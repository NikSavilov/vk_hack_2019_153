import React from "react";
import PropTypes from "prop-types";
import { Div, Group, Panel, PanelHeader} from "@vkontakte/vkui";
import { BackButton } from "../../components/BackButton";
import {InfoBlockAboutInsult} from "../../components/InfoBlockAboutInsult";
import {InfoBlockAboutFund} from "../../components/InfoBlockAboutFund/InfoBlockAboutFund";

export const Info = props => (
  <Panel id={props.id}>
    <PanelHeader left={<BackButton onClick={props.go} to="home" />}>
      Информация
    </PanelHeader>
    <Group title="ПОДРОБНАЯ ИНФОРМАЦИЯ">
      <Div>
        <InfoBlockAboutInsult />
        <InfoBlockAboutFund/>
      </Div>
    </Group>
  </Panel>
);

Info.propTypes = {
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired
};
