import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import './InfoBox.css';

export default function InfoBox({ info }) {

    const INIT_URL =
        "https://images.unsplash.com/photo-1680352267694-a7fd4c33d4e1?w=800&auto=format&fit=crop";

    return (

        <div className="InfoBox">

            <h1>Weather Info - {info.weather}</h1>

            <div className='CardContainer'>

                <Card sx={{ maxWidth: 345 }}>

                    <CardMedia
                        sx={{ height: 140 }}
                        image={INIT_URL}
                        title="weather image"
                    />

                    <CardContent>

                        <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                        >
                            {info.city}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                        >

                            <p>Temperature = {info.temp}°C</p>

                            <p>Humidity = {info.humidity}</p>

                            <p>Min Temp = {info.temMin}°C</p>

                            <p>Max Temp = {info.temMax}°C</p>

                            <p>Feels Like = {info.feelsLike}°C</p>

                        </Typography>

                    </CardContent>

                    <CardActions>
                        <Button size="small">Share</Button>
                        <Button size="small">Learn More</Button>
                    </CardActions>

                </Card>

            </div>

        </div>
    );
}