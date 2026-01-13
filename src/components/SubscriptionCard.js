import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "next-auth/react";

export default function SubscriptionCard({
  title,
  body,
  imageUrl,
  href,
  ctaText,
  button,
  buttonText = "Buy now",
  boxShadow = 0,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { status } = useSession();

  const handleClose = () => {
    setDialogOpen(false);
  };

  const isLoggedIn = status === "authenticated";

  const notLoggedInButton = (
    <Button size="small" color="secondary" onClick={() => setDialogOpen(true)}>
      {buttonText}
    </Button>
  );

  return (
    <>
      <Card
        size="sm"
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
        <CardMedia
          component="img"
          height="140"
          image={imageUrl}
          alt="Service"
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ color: "text.primary" }}
          >
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
          {/* {href && (
          <Button size="small" color="secondary">
            {ctaText}
          </Button>
        )} */}
          {isLoggedIn ? button : notLoggedInButton}
        </CardActions>
      </Card>
      <Dialog onClose={handleClose} open={dialogOpen}>
        <DialogTitle>Login / Registration Required</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <Typography sx={{ p: 2 }} variant="body1">
          You need to be logged in to subscribe. Please log in or register for
          an account.
        </Typography>
      </Dialog>
    </>
  );
}
