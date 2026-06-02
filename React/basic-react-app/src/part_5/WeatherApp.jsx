import SearchBox from "./SearchBox.jsx";
import InfoBox from "./InfoBox.jsx";
import { useState } from "react";

export default function WeatherApp(){
    const [weatherInfo, setWeaterInfo] = useState({
        city:"Wonderland",
        feelslike: 24,
        temp:25,
        tempMin:22,
        humidity:47,
        weather:"haze",
    })

    let updateInfo = (newInfo)=>{
        setWeaterInfo(newInfo);
    }

    return (
        <div style={{textAlign:"center"}}>
            <h2>Weather App</h2>
            <SearchBox updateInfo={updateInfo}/>
            <InfoBox info={weatherInfo}/>
        </div>
    )
}