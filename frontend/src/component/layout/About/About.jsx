import React from "react";
import "./About.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import GitHub from "@material-ui/icons/GitHub";
import InstagramIcon from "@material-ui/icons/Instagram";
const About = () => {
  const visitInstagram = () => {
    window.location = "https://www.instagram.com/_.arjunpatel";
  };
  return (
    <div className="aboutSection">
      <div></div>
      {/* <div className="aboutSectionGradient"></div> */}
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dryylor5o/image/upload/e_improve:outdoor:51/avatars/npheeferknqndeguqieb.jpg"
              alt="Founder"
            />
            <Typography>Arjun Patel</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
            This website is designed and maintained by Arjun Patel. For professional website development services tailored to your business needs, please get in touch. You can find my contact details in the Contact section of the Navigation Bar.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Let's Connect!</Typography>
            <a
              href="https://github.com/patelarjun164"
              target="blank"
            >
              <GitHub  className="githubSvgIcon"/>
            </a>

            <a href="https://www.instagram.com/_.arjunpatel" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;