import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import { Home } from "@carbon/icons-react";
import { Search } from "@carbon/icons-react";
import { Email as Envelope } from "@carbon/icons-react";
import { Tag } from "@carbon/icons-react";

import Item from "./Item";
import Expand from "./Expand";
import { icon } from "../../utils/type";
import { useTheme } from "../../layouts/theme";

const Menu = (props) => {
  const { screenWidth } = props;

  const [open, setOpen] = useState(false);
  const [hiddenItems, setHiddenItems] = useState([]);
  const [renderedItems, setRenderedItems] = useState([]); // will contain references to rendered DOM elements of menu

  const theme = useTheme();

  const itemList = useRef();

  const pages = props.pages.map(page => ({
    to: page.node.fields.slug,
    label: page.node.frontmatter.menuTitle
      ? page.node.frontmatter.menuTitle
      : page.node.frontmatter.title
  }));

  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/type/blog", label: "Blogs", icon: icon("blog") },
    { to: "/type/talk", label: "Talks", icon: icon("talk") },
    { to: "/type/media", label: "Media", icon: icon("media") },
    { to: "/type/podcast", label: "Podcasts", icon: icon("podcast") },
    { to: "/type/book", label: "Books", icon: icon("book") },
    { to: "/category/", label: "Topics", icon: Tag },
    props.searchAvailable && { to: "/search/", label: "Search", icon: Search },
    ...pages,
    { to: "/contact/", label: "Contact", icon: Envelope }
  ].filter(item => item); // Lazily filter out undefined items


  useEffect(() => {
    setRenderedItems(getRenderedItems());
  }, []);

  useLayoutEffect(() => {
    closeMenu();
  }, [props.path]);


  useLayoutEffect(() => {

    hideOverflowedMenuItems();

  }, [props.path, props.fixed, screenWidth, props.fontLoaded]);

  const getRenderedItems = () => {
    const lis = itemList.current;
    return Array.from(lis.children);
  };

  const hideOverflowedMenuItems = () => {

    const PADDING_AND_SPACE_FOR_MORELINK = props.screenWidth >= 1024 ? 60 : 0;

    const itemsContainer = itemList.current;
    const maxWidth = itemsContainer.offsetWidth - PADDING_AND_SPACE_FOR_MORELINK;

    setHiddenItems([]); // clears previous state

    const menu = renderedItems.reduce(
      (result, item) => {

        item.classList.add("item");
        item.classList.remove("hideItem");

        const currentCumulativeWidth = result.cumulativeWidth + item.offsetWidth;
        result.cumulativeWidth = currentCumulativeWidth;

        if (!item.classList.contains("more") && currentCumulativeWidth > maxWidth) {
          const link = item.querySelector("a");

          item.classList.add("hideItem");
          item.classList.remove("item");
          result.hiddenItems.push({
            to: link.getAttribute("data-slug"),
            label: link.text
          });
        }
        return result;
      },
      { visibleItems: [], cumulativeWidth: 0, hiddenItems: [] }
    );

    setHiddenItems(menu.hiddenItems);
  };

  const toggleMenu = e => {
    e.preventDefault();

    if (props.screenWidth < 1024) {
      renderedItems.map(item => {
        const oldClass = open ? "showItem" : "hideItem";
        const newClass = open ? "hideItem" : "showItem";

        if (item.classList.contains(oldClass)) {
          item.classList.add(newClass);
          item.classList.remove(oldClass);
        }
      });
    }

    setOpen(!open);
  };

  const closeMenu = e => {
    //e.preventDefault();

    if (open) {
      setOpen(false);
      if (props.screenWidth < 1024) {
        renderedItems.map(item => {
          if (item.classList.contains("showItem")) {
            item.classList.add("hideItem");
            item.classList.remove("item");
          }
        });
      }
    }
  };

  console.log("Hidden length is ", hiddenItems);

  return (
    <React.Fragment>
      <nav className={`menu ${open ? "open" : ""}`} rel="js-menu">
        <ul className="itemList" ref={itemList}>
          {items.map(item => (
            <Item item={item} key={item.label} icon={item.icon} />
          ))}
        </ul>
        {hiddenItems.length > 0 && <Expand onClick={toggleMenu} />}
        {open && screenWidth >= 1024 && (
          <ul className="hiddenItemList">
            {hiddenItems.map(item => (
              <Item item={item} key={item.label} hiddenItem />
            ))}
          </ul>
        )}
      </nav>

      {/* --- STYLES --- */}
      <style jsx>{`
        .menu {
          align-items: center;
          background: ${theme.color.neutral.white};
          bottom: 0;
          display: flex;
          flex-grow: 1;
          left: 0;
          max-height: ${open ? "1000px" : "50px"};
          padding: 0 ${theme.space.inset.s};
          position: fixed;
          width: 100%;
          z-index: 1;
          transition: all ${theme.time.duration.default};
        }

        .itemList {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          list-style: none;
          margin: 0;
          padding: 0;
          position: relative;
          width: 100%;
        }

        @below desktop {
          .menu {
            &::after {
              position: absolute;
              content: "";
              left: ${theme.space.m};
              right: ${theme.space.m};
              top: 0;
              height: 1px;
              background: ${theme.color.brand.primary};
            }

            &.open {
              padding: ${theme.space.inset.m};
            }

            :global(.homepage):not(.fixed) & {
              bottom: -100px;
            }
          }
        }

        @from-width desktop {
          .menu {
            border-top: none;
            background: transparent;
            display: flex;
            position: relative;
            justify-content: flex-end;
            padding-left: 50px;
            transition: none;
          }

          .itemList {
            justify-content: flex-end;
            padding: 0;
          }

          .hiddenItemList {
            list-style: none;
            margin: 0;
            position: absolute;
            background: ${theme.background.color.primary};
            border: 1px solid ${theme.line.color};
            top: 48px;
            right: ${theme.space.s};
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            padding: ${theme.space.m};
            border-radius: ${theme.size.radius.small};
            border-top-right-radius: 0;

            &:after {
              content: "";
              background: ${theme.background.color.primary};
              z-index: 10;
              top: -10px;
              right: -1px;
              width: 44px;
              height: 10px;
              position: absolute;
              border-left: 1px solid ${theme.line.color};
              border-right: 1px solid ${theme.line.color};
            }

            :global(.homepage):not(.fixed) & {
              border: 1px solid transparent;
              background: color(white alpha(-10%));
              top: 50px;

              &:after {
                top: -11px;
                border-left: 1px solid transparent;
                border-right: 1px solid transparent;
                background: color(white alpha(-10%));
              }
            }

            :global(.fixed) & {
              top: 44px;
            }
          }
        }
      `}</style>
    </React.Fragment>
  );
};


Menu.propTypes = {
  path: PropTypes.string.isRequired,
  fixed: PropTypes.bool.isRequired,
  screenWidth: PropTypes.number.isRequired,
  fontLoaded: PropTypes.bool.isRequired,
  pages: PropTypes.array.isRequired

};

export default Menu;
