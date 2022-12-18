const formJS = document.querySelectorAll("form")[0];
// JS'de querySelectorAll ile yaptığımız seçim gibi Jquery'de eleman seçimi yapıyoruz. JS döngü ile yaptığımız elemanlara ulaşma işini Jquery'de döngüye gerek kalmadan yapabiliyoruz.

//jQUERY === $
//const formJquery = jQuery("form").eq(0);
// eq(index) ile istediğimiz elemana indexleme yapar gibi ulaşıyoruz. veriler array olarak geliyor. formu değiştirmek için eq(index) kullanılıyor.
const formJquery = $("form");
const inputJQ = $(".top-banner input").eq(0);
const msgJQ = $(".top-banner span").eq(0);
const listJQ = $(".cities").eq(0);

// console.log(formJS);
// console.log(formJquery);
// console.log(inputJQ);

// get(index) ==> toArray(get()) , eq(index)
// get ile array'a çevriliyor.

//load VS DOMContentLoaded
//DOMContentLoaded ==> means page rendered, DOM is ready
//window load ==> (all content (e.g. images, styles etc) also loaded)

//window.onload = () =>{} ===> JS window onload böyle JQ $
// addEventListener ===> on gibi.
$(window).on("load", () => {
  console.log("window.load");
});

// document.addEventListener("DOMContentLoaded", ()=>{}) ==> JS
// $(document).on("DOMContentLoaded", () => {
//   console.log("DOMContentLoaded");
// });

$(document).ready(() => {
  console.log("DOMContentLoaded");
  localStorage.setItem(
    "apiKey",
    EncryptStringAES("601b4db5346620a012ec906f1ad3829e")
  );
});

// formJquery.on("submit", (e) => {
//   e.preventDefault();
//   getWeatherDataFromApi();
// });

// yukardakinin farklı kullanımı. event'i fonksiyon olarak kullandık.
formJquery.submit((e) => {
  e.preventDefault();
  getWeatherDataFromApi();
});

const getWeatherDataFromApi = async () => {
  //console.log("AJAX Func. is called");
  const apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
  //JS .value == jQUERY .val()
  const cityName = inputJQ.val();
  console.log(cityName);
  const units = "metric";
  const lang = "tr";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}&lang=${lang}`;

  // XMLHttpRequest(xhr) vs. fetch() vs. axios vs. $.ajax

  $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    success: (response) => {
      //main body func.
      console.log(response);
      const { main, sys, name, weather } = response;
      const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;
      //alternative iconUrl
      const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

      //js=>document.createElement("li")

      // const createdLi2 = $(document.createElement("li"))

      //weather card control!!

      const cityCardList = listJQ.find(".city");
      const cityCardListArray = cityCardList.get();

      //console.log(cityCardList);
      if (cityCardListArray.length > 0) {
        const filteredArray = cityCardListArray.filter(
          (li) => $(li).find("span").text() == name
        );
        if (filteredArray.length > 0) {
          //innerText
          msgJQ.text(
            `You already know the weather for ${name}, Please search for another city 😉`
          );
          //styling
          msgJQ.css({ color: "red", "text-decoration": "underline" });
          return;
        }
      }

      const createdLi = $("<li></li>");
      createdLi.addClass("city");
      createdLi.html(`
            <h2 class="city-name" data-name="${name}, ${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
            <figure>
                <img class="city-icon" src="${iconUrl}">
                <figcaption>${weather[0].description}</figcaption>
            </figure>`);

      //append vs. prepend both in JS AND JQUERY
      listJQ.prepend(createdLi);

      //Jquery Samples
      //   $(".city img").click((e) => {
      //     //getAttribute, setAttribute ==> attr
      //     window.location.href = $(e.target).attr("src");
      //     //$(e.target).attr("src", iconUrlAWS);
      //   });

      //Animation
      //   $(".city").click((e) => {
      //     $(e.target).animate({ left: "250px" });
      //   });

      //Jquery chaining slideUp vs. slideDown
      //   $(".city img").click((e) => {
      //     $(e.target).slideUp(2000).slideDown(2000);
      //   });

      //hide() vs show()
      $(".city img").click((e) => {
        $(e.target).hide();
      });

      //formJS.reset();
      formJquery.trigger("reset");
    },
    beforeSend: (request) => {
      //Encryption
      //header/body
      //token
      console.log("before ajax send");
    },
    complete: () => {
      console.log("after ajax send");
    },
    error: (XMLHttpRequest) => {
      //logging
      //postErrorLog(p1,p2,p3,p4);
      console.log(XMLHttpRequest);
      msgJQ.text(`${XMLHttpRequest.status} ${XMLHttpRequest.statusText}`);
      //styling
      msgJQ.css({ color: "red", "text-decoration": "underline" });
    },
  });
};
