import { PresentationFile20 as PresentationFile } from "@carbon/icons-react";
import { UserSpeaker20 as UserSpeaker } from "@carbon/icons-react";
import { Notebook20 as Notebook } from "@carbon/icons-react";
import { Document20 as Document } from "@carbon/icons-react";
import { Microphone20 as Microphone } from "@carbon/icons-react";
import { EventsAlt20 as EventsAlt } from "@carbon/icons-react";
import { LicenseGlobal20 as LicenseGlobal } from "@carbon/icons-react";
import React from "react";

const typeIcons = {
  blog: Document,
  talk: PresentationFile,
  media: UserSpeaker,
  book: Notebook,
  podcast: Microphone,
  webinar: EventsAlt
};

export function plural(type) {
  let plural = type + "s";

  // Handle special cases
  if (plural === "medias") {
    plural = type;
  }
  return plural;
}

export function icon(type) {
  return class extends React.Component {
    render() {
      return <Icon type={type} />;
    }
  };
}

// Set type as an attribute/property to get the right icon type
export class Icon extends React.Component {
  render() {
    const type = this.props.type;
    const title = typeIcons[type] ? `${type} icon` : "unknown icon";
    const Icon = typeIcons[type] ? typeIcons[type] : LicenseGlobal;
    return <Icon {...this.props} title={title} />;
  }
}
