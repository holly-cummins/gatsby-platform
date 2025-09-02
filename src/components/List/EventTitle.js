import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import { Badge as Star } from "@carbon/icons-react";
import { Video as Video } from "@carbon/icons-react";
import { PresentationFile as Slide } from "@carbon/icons-react";
import { useTheme } from "../../layouts/theme";
import useFitText from "use-fit-text";

const EventTitle = props => {
  const { date, event, showDate, listener } = props;
  const theme = useTheme();
  const { fontSize, ref } = useFitText();


  // Make sure we don't have a null hanging around in the date
  const cleanDate = date ? date : "..";

  return (<React.Fragment>

      {showDate && <div ref={ref} className="event"
                        onMouseOver={listener}
                        onMouseOut={listener}>
          {cleanDate}
        </div> ||
        <div ref={ref} className="event" style={{ fontSize }}
             onMouseOver={listener}
             onMouseOut={listener}>
          {event}
        </div>}
      {/* --- STYLES --- */}
      <style jsx>{`
        .event {
          color: ${theme.color.brand.light};
          max-width: 25%;
          min-width: 25%;
          height: 40px;
        }
      `}</style>
    </React.Fragment>
  );

};

EventTitle.propTypes = {
  edges: PropTypes.array.isRequired,
  showDate: PropTypes.bool,
  listener: PropTypes.func
};

export default EventTitle;
