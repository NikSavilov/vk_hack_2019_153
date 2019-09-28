import React, { useState } from "react";
import PropTypes from "prop-types";
import { Panel, Button, Div, PanelHeader } from "@vkontakte/vkui";
import "./Home.css";
import { TripleDotsIcon } from "../../icons/TripleDotsIcon";
import { ArrowIcon } from "../../icons/ArrowIcon";

export const Home = ({ id, go, fetchedUser }) => {
  const [state, setState] = useState({
    mainText: "Мы благотворительный фонд по борьбе с инсультом.",
    page: 1,
    buttonTitle: "Дальше",
    dataTo: undefined,
    onClick: () => {
      setState({
        mainText: (
          <div>
            Инсульт может коснуться каждого.
            <br />
            450 000 россиян перенесли инсульт за последний год.
            <br />
            136 000 - умерли.
          </div>
        ),
        page: 2,
        buttonTitle: "Дальше",
        onClick: () => {
          setState({
            mainText: (
              <div>
                Пожалуйста, ответьте на вопросы, чтобы мы рассчитали риск
                инсульта для Вас.
                <br />
                Это займёт не больше трёх минут.
              </div>
            ),
            page: 3,
            buttonTitle: "Начать",
            onClick: go
          });
        }
      });
    }
  });

  return (
    <Panel id={id}>
      <PanelHeader className="home__header">ОРБИ</PanelHeader>
      <Div className="home">
        <Div className="home__header">
          <h1>{`Привет, ${fetchedUser ? fetchedUser.first_name : "друг"}!`}</h1>
          <h1>Рады видеть Вас в ОРБИ</h1>
        </Div>

        <Div className="home__main">
          <div>{state.mainText}</div>
          <div>
            <TripleDotsIcon page={state.page} />
          </div>
        </Div>

        <Div className="home__control">
          <Button
            size="xl"
            level="2"
            onClick={state.onClick}
            data-to="questionnaire"
            className="home__control-button"
          >
            <div style={{ marginBottom: "10px" }}>{state.buttonTitle}</div>
            <ArrowIcon />
          </Button>
        </Div>
      </Div>
    </Panel>
  );
};

Home.propTypes = {
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired,
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    city: PropTypes.shape({
      title: PropTypes.string
    })
  })
};
