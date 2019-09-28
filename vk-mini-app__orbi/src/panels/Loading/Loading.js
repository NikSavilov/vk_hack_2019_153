import React from "react";
import PropTypes from "prop-types";
import { Panel, Div, PanelHeader } from "@vkontakte/vkui";
import { BeatLoader } from "react-spinners";
import "./Loading.css";

export const Loading = ({ id }) => {
  return (
    <Panel id={id}>
      <PanelHeader>Загрузка</PanelHeader>
      <Div className="loading">
        <BeatLoader color="white" />
      </Div>
    </Panel>
  );
};

Loading.propTypes = {
  id: PropTypes.string.isRequired
};
