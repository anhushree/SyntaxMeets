import React, { useState } from "react";
import GroupIcon from "@material-ui/icons/Group";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Drawer,
  Typography,
  Divider,
  List,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  list: {
    width: 400,
  },
  fullList: {
    width: "auto",
  },
});
const nameGenerator = (name) =>
  (name[0][0] + (name.length > 1 ? name[1][0] : "")).toUpperCase();

function ParticipantsList(props) {
  const classes = useStyles();

  const { users } = props;
  const [openList, setOpenList] = useState(false);

  const renderParticipants = () => {
    return Object.keys(users).map((elem) => {
      const name = users[elem];
      return (
        <>
          <ListItem>
            <ListItemAvatar>
              <Avatar style={{ fontWeight: "bold" }}>
                {nameGenerator(name.split(" "))}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              style={{
                borderRadius: "10px",
                padding: "10px",
                color: "rgb(62 53 53)",
                border: "solid rgb(62 53 53) 1px",
                textAlign: "center",
                fontWeight: "bolder",
              }}
              primary={name}
            />
          </ListItem>
        </>
      );
    });
  };
  return (
    <div>
      <Button
        onClick={() => setOpenList(true)}
        variant="contained"
        color="primary"
        startIcon={<GroupIcon />}
        style={{
          fontFamily: "poppins",
          marginLeft: "15px",
          fontWeight: "600",
          color: "white",
        }}
      >
        Participants
      </Button>
      <Drawer
        anchor={"right"}
        open={openList}
        onClose={() => setOpenList(false)}
      >
        <div
          className={classes.list}
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100%",
            overflowY: "scroll",
          }}
          role="presentation"
        >
          <List>{renderParticipants()}</List>
        </div>
      </Drawer>
    </div>
  );
}

export default ParticipantsList;
