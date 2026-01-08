import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

export default function SimpleCard({
  title,
  body,
  imageUrl,
  href,
  ctaText,
  button,
  boxShadow = 0,
}) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        boxShadow,
        transition: "0.1s",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        // "&:hover": { transform: "scale(1.02) perspective(0px)" },
      }}
    >
      <CardMedia component="img" height="140" image={imageUrl} alt="Service" />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary" }}
          component="div"
        >
          {body}
        </Typography>
      </CardContent>
      <CardActions>
        {href && (
          <Button size="small" color="secondary">
            {ctaText}
          </Button>
        )}
        {button}
      </CardActions>
    </Card>
  );
}
