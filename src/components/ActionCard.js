import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

export default function ActionCard({ title, body, imageUrl, href, ctaText }) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea href={href}>
        <CardMedia
          component="img"
          height="140"
          image={imageUrl}
          alt="Service"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {body}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          {ctaText}
        </Button>
      </CardActions>
    </Card>
  );
}
