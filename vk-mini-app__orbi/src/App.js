import React from "react";
import connect from "@vkontakte/vk-connect";
import { View } from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import { Home } from "./panels/Home/Home";
import { Questionnaire } from "./panels/Questionnaire";
import "./styles.css";
import { MainPage } from "./panels/MainPage";
import { Loading } from "./panels/Loading";

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePanel: "loading",
      fetchedUser: null,
      history: ["home"],
      answers: null,
      modal: null,
      isUserRegistered: false
    };
  }

  componentDidMount() {
    connect.subscribe(async e => {
      switch (e.detail.type) {
        case "VKWebAppGetUserInfoResult":
          const user = e.detail.data;
          await fetch(
            `https://niksavilov.pythonanywhere.com/api/customers/registered/?user_id=${user.id}`
          )
            .then(response => response.clone().json())
            .then(async ({ is }) => {
              if (is) {
                await fetch(
                  `https://niksavilov.pythonanywhere.com/api/customers/get_main_page/?user_id=${user.id}`
                )
                  .then(response => {
                    if (response.status !== 200) {
                      return Promise.reject();
                    }
                    return response.clone().json();
                  })
                  .then(customer => {
                    this.setState({
                      fetchedUser: user,
                      activePanel: "main",
                      answers: customer
                    });
                  });
              } else {
                this.setState({ fetchedUser: user, activePanel: "home" });
              }
            });
          break;
        default:
          break;
      }
    });
    connect.send("VKWebAppGetUserInfo", {});
    // this.setState({ activePanel: "home" });
  }

  go = e => {
    this.setState({ activePanel: e.currentTarget.dataset.to });
  };

  goBack = () => {
    const history = [...this.state.history];
    history.pop();
    const activePanel = history[history.length - 1];
    if (activePanel === "main") {
      connect.send("VKWebAppDisableSwipeBack", {});
    }
    this.setState({ history, activePanel });
  };

  goForward = activePanel => {
    const history = [...this.state.history];
    history.push(activePanel);
    if (this.state.activePanel === "home") {
      connect.send("VKWebAppEnableSwipeBack", {});
    }
    this.setState({ history, activePanel });
  };

  setModal = modal => {
    this.setState({ modal });
  };

  render() {
    return (
      <View
        onSwipeBack={this.goBack}
        history={this.state.history}
        activePanel={this.state.activePanel}
        modal={this.state.modal}
      >
        <Home id="home" fetchedUser={this.state.fetchedUser} go={this.go} />
        <Questionnaire
          id="questionnaire"
          go={(event, answers) => {
            this.setState({ answers });
            this.setState({ activePanel: "main" });
          }}
          fetchedUser={this.state.fetchedUser}
        />
        <MainPage
          go={this.go}
          answers={this.state.answers}
          id="main"
          setModal={this.setModal}
        />
        <Loading id="loading" />
      </View>
    );
  }
}
