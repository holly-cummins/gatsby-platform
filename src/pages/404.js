import React from "react";
import Article from "../components/Article";
import Headline from "../components/Article/Headline";
import cat from "../images/jpg/hairball.png";
import { useTheme } from "../layouts/theme";

const NotFoundPage = () => {

  const theme = useTheme();

  return (
    <React.Fragment>
      <Article>
        <header>
          <Headline title="Well, that didn't go well." theme={theme} />
        </header>
        <p>Looks like I haven't written that one yet.</p>
        <img src={cat} alt="a cat throwing up a hairball" />
        {/* --- STYLES --- */}
        <style jsx>
          {`
            div {
              display: flex;
              justify-content: flex-start;
              align-items: center;
            }

            img {
              padding: ${theme.space.m};
              width: 450px;
            }
          `}
        </style>
      </Article>
    </React.Fragment>
  );
};

export default NotFoundPage;
