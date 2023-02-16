import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

export default function TeamMember(props) {
    return(
        <Card style={{backgroundColor: 'lavender'}}>
            <CardActionArea>
                <CardContent>
                    <h3>{props.name}, {props.year}</h3>
                    <h4>{props.role}</h4>
                    
                </CardContent>
                <CardMedia
                    component="img"
                    alt={props.name}
                    image={props.imgsrc}
                ></CardMedia>
            </CardActionArea>
        </Card>
    )
}