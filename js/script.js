/***** spreadsheets from google *****/

//
//https://docs.google.com/spreadsheets/d/1SQeili57IfygzYF7DD56KJAniwXYIeGCbWZdphcn0Ds/edit?ts=5e4fb156#gid=0


/***** Get Data from google sheets *****/

const link = "https://spreadsheets.google.com/feeds/list/1SQeili57IfygzYF7DD56KJAniwXYIeGCbWZdphcn0Ds/od6/public/values?alt=json";
window.addEventListener("DOMContentLoaded", getData);

/***** modal *****/

const modal = document.querySelector(".modal-background");
const options = document.querySelectorAll("option");

modal.addEventListener("click", () => {
    modal.classList.add("hide");
});

/***** fetch Data *****/


function getData() {


    fetch(link)
        .then(res => res.json())
        .then(handleData);

}

/***** filter section *****/

function handleData(data) {
    const myData = data.feed.entry;

    const cityBtns = document.querySelectorAll(".city");
    cityBtns.forEach(cityBtn => {
        cityBtn.addEventListener("click", filterContent);

    })

    const mountainBtns = document.querySelectorAll(".mountain");
    mountainBtns.forEach(mountainBtn => {
        mountainBtn.addEventListener("click", filterContent);

    })


    const beachBtns = document.querySelectorAll(".beach");
    beachBtns.forEach(beachBtn => {
        beachBtn.addEventListener("click", filterContent);

    })


    /***** showing all cards part content *****/

    myData.forEach(showData);

    /***** filter function *****/

    let result = [];

    function filterContent(e) {


        console.log(e.currentTarget.className);

        options.forEach(item => {
            if (item.selected) {
                document.querySelector(".card-headline").textContent = e.currentTarget.className;

                result = myData.filter(item => item.gsx$category.$t === e.currentTarget.className);
                document.querySelector(".container").innerHTML = "";
                console.log('selected option', item.id)

                sortList(item.id);
                result.forEach(showData);


            }

        })
    }

    /***** sorting section based on price and rate *****/

    function sortList(sortType) {
        console.log("result", result);



        if (result.length > 1 & sortType === "rate") {
            document.querySelector(".card-headline").textContent = result[0].gsx$category.$t;
            result.sort(function (a, b) {
                return a.gsx$rating.$t - b.gsx$rating.$t;
            })
            document.querySelector(".container").innerHTML = "";
            document.querySelector(".card-subheadline").textContent = "Best rating first"

            result.reverse();
            result.forEach(showData);
        } else if (result.length > 1 & sortType === "price") {
            document.querySelector(".card-headline").textContent = result[0].gsx$category.$t;
            result.sort(function (a, b) {
                return a.gsx$price.$t - b.gsx$price.$t;
                console.log(a, b)
            })
            document.querySelector(".container").innerHTML = "";
            document.querySelector(".card-subheadline").textContent = "Cheapest price first"

            result.forEach(showData);
        } else if (result.length < 1 & sortType === "rate") {
            myData.sort(function (a, b) {
                return a.gsx$rating.$t - b.gsx$rating.$t;
            })
            document.querySelector(".container").innerHTML = "";
            document.querySelector(".card-subheadline").textContent = "Best rating first";
            document.querySelector(".card-headline").textContent = "Hot Tours";


            myData.reverse();
            myData.forEach(showData);

        } else if (result.length < 1 & sortType === "price") {
            myData.sort(function (a, b) {
                return a.gsx$price.$t - b.gsx$price.$t;
                console.log(a, b)
            })
            document.querySelector(".container").innerHTML = "";
            document.querySelector(".card-subheadline").textContent = "Cheapest price first"
            document.querySelector(".card-headline").textContent = "Hot Tours";

            myData.forEach(showData);

        }

    }

    const submit = document.getElementById("submitBtn");


    submit.addEventListener("click", select)

    function select() {
        options.forEach(option => {

            if (option.selected) {
                sortList(option.id)
            }
        })
    }

}

/***** showing data in to the template *****/

function showData(singleRowData) {

    const template = document.querySelector("template").content;
    const myClone = template.cloneNode(true);

    myClone.querySelector(".card-image").style.backgroundImage = `url(${singleRowData.gsx$imageurl.$t})`;

    myClone.querySelector(".card-price span").textContent =
        singleRowData.gsx$price.$t;

    myClone.querySelector(".card-title").textContent =
        `${singleRowData.gsx$name.$t}, ${singleRowData.gsx$location.$t}`;
    myClone.querySelector(".card-description").textContent =
        singleRowData.gsx$shortdescription.$t;


    /***** stars rating part *****/
    if (singleRowData.gsx$rating.$t == 5) {
        myClone.querySelector(".rating").innerHTML = `<i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i>`;
    } else if (singleRowData.gsx$rating.$t == 4) {
        myClone.querySelector(".rating").innerHTML = `<i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i>`;
    } else if (singleRowData.gsx$rating.$t == 3) {
        myClone.querySelector(".rating").innerHTML = `<i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i>`
    } else if (singleRowData.gsx$rating.$t == 2) {
        myClone.querySelector(".rating").innerHTML = `<i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i>`
    } else {
        myClone.querySelector(".rating").innerHTML = `<i class="fas fa-star star-icon"></i>`
    }

    /***** Modal *****/
    myClone.querySelector(".card-button").addEventListener("click", showModal);

    function showModal() {
        console.log(singleRowData);
        modal.querySelector(".modal-name").textContent = `${singleRowData.gsx$name.$t}, ${singleRowData.gsx$location.$t}`;
        modal.querySelector(".modal-description").textContent = singleRowData.gsx$fulldescription.$t;
        modal.querySelector(".modal-image").style.backgroundImage = `url(${singleRowData.gsx$imageurl.$t})`;
        modal.querySelector(".modal-price span").textContent = singleRowData.gsx$price.$t;

        if (singleRowData.gsx$rating.$t == 5) {
            modal.querySelector(".modal-rating").innerHTML = `<i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i>`;
        } else if (singleRowData.gsx$rating.$t == 4) {
            modal.querySelector(".modal-rating").innerHTML = `<i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i>`;
        } else if (singleRowData.gsx$rating.$t == 3) {
            modal.querySelector(".modal-rating").innerHTML = `<i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i>`
        } else if (singleRowData.gsx$rating.$t == 2) {
            modal.querySelector(".modal-rating").innerHTML = `<i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i>`
        } else {
            modal.querySelector(".modal-rating").innerHTML = `<i class="fas fa-star star-icon"></i>`
        }

        modal.classList.remove("hide");
    }

    const place = document.querySelector(".container");
    place.appendChild(myClone);

}

/*** scroll to top button */

scroll = document.getElementById("scroll");
window.onscroll = function () {
    scrollDisplay()
};

function scrollDisplay() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scroll.style.display = "block";
    } else {
        scroll.style.display = "none";
    }
}

function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

/*** scrolling */

const aboutBtn1 = document.querySelector(".intro-button1");
const aboutBtn2 = document.querySelector(".intro-button2");
const aboutBtn3 = document.querySelector(".intro-button3");
const aboutBtn4 = document.querySelector(".footer-about");
const teamBtn = document.querySelector(".footer-team");
const toursBtn = document.querySelector(".footer-tours");
const aboutS = document.querySelector("#about");
const teamS = document.querySelector("#team");
const toursS = document.querySelector(".introGallery");

aboutBtn1.addEventListener("click", scrollToAbout);
aboutBtn2.addEventListener("click", scrollToAbout);
aboutBtn3.addEventListener("click", scrollToAbout);
aboutBtn4.addEventListener("click", scrollToAbout);
teamBtn.addEventListener("click", scrollToTeam);
toursBtn.addEventListener("click", scrollToTours);

function scrollToAbout() {
    aboutS.scrollIntoView();
}

function scrollToTeam() {
    teamS.scrollIntoView();
}

function scrollToTours() {
    toursS.scrollIntoView();
}


/******* slide show ******/

let slideIndex = 0;
showSlides();

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1
    }
    //
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 4000); // Change image every 2 seconds
};
