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
      <div className="aboutSectionGradient"></div>
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
              This is a sample wesbite made by @arjun. If you want make website for your bussiness please contact me. Contact details are mentioned in contacttab section.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
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