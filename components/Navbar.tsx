import { useEffect, useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  Text,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useUser } from "../context/user";
import Link from "next/link";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

interface HeaderResponsiveProps {
  links: { link: string; label: string }[];
}

let links = [
  {
    link: "/profile",
    label: "Profile",
    type: "link",
    callback: undefined,
  },
  {
    link: "/",
    label: "Home",
    type: "link",
    callback: undefined,
  },
  {
    link: "/pricing",
    label: "Pricing",
    type: "link",
    callback: undefined,
  },
  {
    link: "",
    label: "Login",
    type: "button",
    callback: undefined,
  },
];

export function HeaderResponsive() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const router = useRouter();
  const [active, setActive] = useState(router.pathname);
  const { classes, cx } = useStyles();
  const { user, isLoading, login } = useUser();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) {
      links = links.filter((ele) => ele.link !== "/profile");
      const items = links.map((link) => {
        switch (link.type) {
          case "link":
            return (
              <a
                key={link.label}
                href={link.link}
                className={cx(classes.link, {
                  [classes.linkActive]: active === link.link,
                })}
                onClick={(event) => {
                  event.preventDefault();
                  setActive(link.link);
                  close();
                  router.push(link.link);
                }}
              >
                {link.label}
              </a>
            );
          case "button":
            return (
              <Button onClick={() => login} size="xs" mt={5} ml={12}>
                {link.label}
              </Button>
            );
        }
      });
      //   @ts-ignore
      setItems(items);
    }
  }, [user]);

  return (
    <Header height={HEADER_HEIGHT} mb={120} className={classes.root}>
      <Container className={classes.header}>
        <Text fw={700}>SASS</Text>
        <Group spacing={5} className={classes.links}>
          {/* {items} */}
          <Link
            href="/"
            className={cx(classes.link, {
              [classes.linkActive]: router.pathname === "/" ? true : false,
            })}
          >
            Home
          </Link>
          <Link
            href="/pricing"
            className={cx(classes.link, {
              [classes.linkActive]:
                router.pathname === "/pricing" ? true : false,
            })}
          >
            Pricing
          </Link>
          {!!user && (
            <Link
              href="/profile"
              className={cx(classes.link, {
                [classes.linkActive]:
                  router.pathname === "/profile" ? true : false,
              })}
            >
              Profile
            </Link>
          )}

          {!isLoading && (
            <Link
              href={user ? "/profile" : "#"}
              className={cx(classes.link, {
                [classes.linkActive]:
                  router.pathname === `${user ? "/profile" : "/login"}`
                    ? true
                    : false,
              })}
              onClick={() => {
                if (!user) login();
              }}
            >
              {user ? "Logout" : "Login"}
            </Link>
          )}
        </Group>

        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
