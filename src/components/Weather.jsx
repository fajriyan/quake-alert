import axios from 'axios';
import { useEffect, useState } from 'react';

const Weather = () => {
  const [data, setData] = useState();
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [error, setError] = useState(null); 

  const getCurrentWeather = async () => {
    const cachedData = localStorage.getItem('weatherData');
    const cacheExpiration = localStorage.getItem('weatherDataExpiration');

    if (cachedData && cacheExpiration && new Date().getTime() < cacheExpiration) {
      setData(JSON.parse(cachedData));
    } else if (lat && lon) { 
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_API_WEATHER_VENDOR}&units=metric&lang=id`
      );
      const get = res.data;
      setData(get);

      localStorage.setItem('weatherData', JSON.stringify(get));
      localStorage.setItem('weatherDataExpiration', new Date().getTime() + 1700000);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Gagal mendapatkan lokasi."); 
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini."); 
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    getCurrentWeather();
  }, [lat, lon]);

  return (
    <div className=''>
      {error ? ( 
        <div className="text-red-500 text-xs">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.69 2 6 4.69 6 8C6 11.86 10.38 17.5 11.63 19.08C11.82 19.32 12.18 19.32 12.37 19.08C13.62 17.5 18 11.86 18 8C18 4.69 15.31 2 12 2Z" 
                  stroke="red" stroke-width="2" fill="none"/>
            <circle cx="12" cy="8" r="2" stroke="red" stroke-width="2" fill="none"/>
            <path d="M4 4L20 20" stroke="red" stroke-width="2" stroke-linecap="round"/>
          </svg>

          </div>
      ) : (
        <div className="w-max rounded-md flex items-center gap-2">
          <img src={`https://openweathermap.org/img/wn/${data?.weather[0]?.icon}@4x.png`} alt="icon cloud" className='w-[50px]' />
          <div className="">
            <p className='font-semibold'>{data?.main?.temp}°C</p>
            <p className='text-xs -mt-1'>
              {data?.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
