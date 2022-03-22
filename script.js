
    window.onload= geolocation();
     function changeMode(){
         var mybody=document.body;
         mybody.classList.toggle('mydark')
     }
     function loadCoupon(){
         document.getElementById('coupon').style.visibility='visible'
     }
     function closeCoupon(){
         document.getElementById('coupon').style.visibility='hidden'
     }
     function geolocation(){
   if(navigator.geolocation){
       navigator.geolocation.getCurrentPosition(showPosition)
   }else{x.innerText="GeoLocation is not supported by this browser.";}
}
function showPosition(data){
   console.log(data)
   let latitude = data.coords.latitude;
   let longitude = data.coords.longitude;
   const url = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&mode=json&units=metric&cnt=1&appid=fbf712a5a83d7305c3cda4ca8fe7ef29`
   fetch(url,{method:'GET'})
   .then((res) => res.json())
   .then((data) => {
       let cityName = data.city.name
       let weather = `${data.list[0].temp.day} Celcius`
       let output = `${weather} ${cityName}`
       console.log(data)
       x.innerText=output;
   })
 }
 const cityUrl = "https:zomatoajulypi.herokuapp.com/location";
const restUrl = "https:zomatoajulypi.herokuapp.com/restaurant?stateId="

 function getCity(){
     fetch(cityUrl)
     .then((res) =>  res.json())
     .then((data) => {
         data.map((item) => {
             let element = document.createElement('option')  //<option></option>
             let text = document.createTextNode(item.state) // delhi
             element.appendChild(text) //<option>delhi</option>
             element.value = item.state_id; //<option value=1>delhi</option>
             document.getElementById('city').appendChild(element)
             /* 
                 <select>
                     <option value=1>delhi</option>
                 </select>
             */
         })
     })
 }

const getRest = () => {
    const cityId = document.getElementById('city').value;
    const rest =  document.getElementById('restaurant')

    while(rest.length > 0){
        rest.remove(0)
    }

    fetch(`${restUrl}${cityId}`)
    .then((res) => res.json())
    .then((data) => {
        data.map((item) => {
            let element = document.createElement('option') // <option></option>
            let text = document.createTextNode(`${item.restaurant_name}|${item.address}`) // delhi
            element.appendChild(text) //<option>delhi</option>
            rest.appendChild(element)
        })
    })
}
