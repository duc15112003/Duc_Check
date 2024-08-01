import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Weather = () => {
  const [temperature, setTemperature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');
  const [rain, setRain] = useState(null);

  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,rain`
        );
        setTemperature(response.data.current.temperature_2m);
        setRain(response.data.current.rain || 0);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    const fetchLocation = async () => {
      try {
        const response = await axios.get('https://ipinfo.io/json');
        const { city, country } = response.data;
        const location = `${city}, ${country}`;
        setCity(location);

        // Lấy toạ độ vĩ độ và kinh độ từ IPInfo nếu cần thiết
        const { loc } = response.data;
        const [latitude, longitude] = loc.split(',');
        fetchWeather(latitude, longitude);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='flex'>
      <text className='text-sm content-center font-semibold'>
        {city} <text className='font-bold text-sky-500'>{temperature} °C</text>
      </text>
      <span className="flex text-sm mx-2">
        {rain === 0 ? (
          <img className='flex'
            src="/clouds.png" 
            alt="Sunny Icon" 
          />
        ) : (
                    <img className='flex'
            src="/rain.png" 
            alt="Rain Icon" 
          />
        )}
      </span> 
    </div>
  );
};

export default Weather;
