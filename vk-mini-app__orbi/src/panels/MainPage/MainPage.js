import React from "react";
import PropTypes from "prop-types";
import { Panel, Div, PanelHeader, ModalRoot, ModalCard } from "@vkontakte/vkui";
import "./MainPage.css";
import { ArrowUpIcon } from "../../icons/ArrowUpIcon";
import * as connect from "@vkontakte/vk-connect";
import {
  getProperPercentage,
  maxRiskValue
} from "../Questionnaire/Questionnaire";
import { ChallengeIcon } from "../../icons/ChallengeIcon";
import { CompletedIcon } from "../../icons/CompletedIcon";
import Icon56MoneyTransferOutline from "@vkontakte/icons/dist/56/money_transfer_outline";
import Textarea from "@vkontakte/vkui/dist/components/Textarea/Textarea";
import Button from "@vkontakte/vkui/dist/components/Button/Button";
import { InfoIcon } from "../../icons/InfoIcon";

export class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      money: this.props.answers.amount,
      isSubscribed: this.props.answers.subscribed,
      userId: this.props.answers.vk_id,
      riskValue: this.props.answers.risk,
      maxRisk: maxRiskValue,
      percentage: getProperPercentage(
        Math.floor((this.props.answers.risk / maxRiskValue) * 100)
      ),
      lastDiffRiskValue: this.props.answers.diff_risk,
      challenges: this.props.answers.current.sort((a, b) => a.id - b.id),
      recommendedChallenges: this.props.answers.recommended,
      modalInputValue: ""
    };
  }

  getPercentage = () => {
    return getProperPercentage(
      Math.floor((this.props.answers.risk / maxRiskValue) * 100)
    );
  };

  getDate = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const dayOfMonth = date.getDate();
    const dayOfWeek = this.getDayOfWeek(date.getDay());

    return `${dayOfWeek} ${dayOfMonth}.${month}`;
  };

  getDayOfWeek = dayNumber => {
    switch (dayNumber) {
      case 0:
        return "Вс";
      case 1:
        return "Пн";
      case 2:
        return "Вт";
      case 3:
        return "Ср";
      case 4:
        return "Чт";
      case 5:
        return "Пт";
      case 6:
        return "Сб";
    }
  };

  changeButtonTheme = currentTarget => {
    const { backgroundColor } = currentTarget.style;

    if (backgroundColor === "rgb(82, 139, 204)") {
      currentTarget.style.backgroundColor = "white";
      currentTarget.style.color = "rgb(82, 139, 204)";
    } else {
      currentTarget.style.backgroundColor = "rgb(82, 139, 204)";
      currentTarget.style.color = "white";
    }
  };

  render() {
    const percentage = this.getPercentage();

    const borderColor = `rgb(${percentage / 0.51}%, ${100 -
      percentage / 0.51}%, 65%)`;

    const { id, setModal } = this.props;

    return (
      <Panel id={id}>
        <PanelHeader>Главная</PanelHeader>
        <Div className="main-page">
          <Div className="main-page__header">
            <Div className="main-page__header-inner">
              <Div
                className="main-page__header-money"
                onClick={() => {
                  setModal(
                    <ModalRoot activeModal="info-about-money">
                      <ModalCard
                        id="info-about-money"
                        onClose={() => setModal(null)}
                        icon={<InfoIcon />}
                        title="Пожертвования"
                        caption="Здесь отображается сумма пожертвований от Вас и от друзей, которых Вы привлекли."
                      />
                    </ModalRoot>
                  );
                }}
              >{`${this.state.money}₽`}</Div>
              <Div className="main-page__diagram-wrapper">
                <Div className="main-page__diagram" style={{ borderColor }}>
                  {`${parseFloat(percentage).toFixed(1)}%`}
                  <br />
                  <Div className="main-page__diagram-dynamic">
                    <ArrowUpIcon
                      className={`main-page__diagram-dynamic-icon ${this.state
                        .lastDiffRiskValue < 0 &&
                        "main-page__diagram-dynamic-icon-rotated"}`}
                    />
                    {`${parseFloat(
                      Math.abs(this.state.lastDiffRiskValue).toFixed(2)
                    )}%`}
                  </Div>
                </Div>
              </Div>
            </Div>

            <Div className="main-page__header-text">
              вы помогли собрать
              <br /> в фонд ОРБИ
            </Div>

            <Div className="main-page__challenges">
              <Div className="main-page__challenges-header">
                <Div className="main-page__challenges-header-text">
                  Челенджи
                </Div>
                <Div className="main-page__challenges-header-date">
                  {this.getDate()}
                </Div>
              </Div>
              <Div className="main-page__challenges-main">
                {Boolean(this.state.challenges && this.state.challenges.length)
                  ? this.state.challenges.map((challenge, key) => {
                      return (
                        <Div
                          className="main-page__challenges-challenge-wrapper"
                          key={key}
                        >
                          <Div
                            className="main-page__challenges-challenge"
                            style={{ opacity: challenge.completed ? 0.75 : 1 }}
                          >
                            <div className="main-page__challenges-challenge-title">
                              {challenge.title}
                            </div>
                          </Div>
                          <div className="main-page__challenges-challenge-icon">
                            <CompletedIcon
                              initFill={
                                challenge.completed ? "#39c3a5" : "white"
                              }
                              onClick={() => {
                                const diff_risk =
                                  challenge.diffRiskValue / challenge.days;
                                const objectToPost = {
                                  user_id: this.state.userId,
                                  completed: !challenge.completed,
                                  id: challenge.id,
                                  diff_risk: !challenge.completed
                                    ? -1 * diff_risk
                                    : diff_risk,
                                  risk: !challenge.completed
                                    ? this.state.riskValue - diff_risk
                                    : this.state.riskValue + diff_risk
                                };

                                const query = Object.keys(objectToPost)
                                  .map(function(k) {
                                    return (
                                      encodeURIComponent(k) +
                                      "=" +
                                      encodeURIComponent(objectToPost[k])
                                    );
                                  })
                                  .join("&");

                                fetch(
                                  `https://niksavilov.pythonanywhere.com/api/customers/apply_challenge/?${query}`
                                ).then(response => response.clone().json());

                                this.setState({
                                  lastDiffRiskValue: !challenge.completed
                                    ? -1 * diff_risk
                                    : diff_risk,
                                  riskValue: !challenge.completed
                                    ? this.state.riskValue - diff_risk
                                    : this.state.riskValue + diff_risk,
                                  challenges: [
                                    ...this.state.challenges.filter(
                                      item => item.id !== challenge.id
                                    ),
                                    {
                                      ...challenge,
                                      completed: !challenge.completed
                                    }
                                  ].sort((a, b) => a.id - b.id)
                                });
                              }}
                            />
                          </div>
                        </Div>
                      );
                    })
                  : "У Вас нет активных челенджей, можете добавить их из списка рекомендуемых."}
              </Div>
            </Div>

            <Div className="main-page__recommended">
              <Div className="main-page__recommended-header">
                <Div className="main-page__recommended-header-text">
                  Рекомендуемые
                </Div>
              </Div>
              <Div className="main-page__recommended-main">
                {!this.state.isSubscribed && (
                  <Div
                    className="main-page__recommended-challenge"
                    style={{ backgroundColor: "#e3b65b" }}
                    onClick={() => {
                      setModal(
                        <ModalRoot activeModal="subscribe">
                          <ModalCard
                            id="subscribe"
                            onClose={() => setModal(null)}
                            icon={<Icon56MoneyTransferOutline />}
                            title="Ежемесячное пожертвование"
                            caption={
                              <Div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between"
                                }}
                              >
                                <Button
                                  level={"outline"}
                                  style={{ margin: "0 3px" }}
                                  className="button-for-payment"
                                  size="xl"
                                  onClick={e => {
                                    const buttons = document.getElementsByClassName(
                                      "button-for-payment"
                                    );

                                    Array.from(buttons).forEach(button => {
                                      button.style.backgroundColor = "white";
                                      button.style.color = "rgb(82, 139, 204)";
                                    });

                                    this.changeButtonTheme(e.currentTarget);

                                    this.setState({
                                      modalInputValue: 100
                                    });
                                  }}
                                >
                                  100
                                </Button>
                                <Button
                                  size="xl"
                                  className="button-for-payment"
                                  style={{ margin: "0 3px" }}
                                  level={"outline"}
                                  onClick={e => {
                                    const buttons = document.getElementsByClassName(
                                      "button-for-payment"
                                    );

                                    Array.from(buttons).forEach(button => {
                                      button.style.backgroundColor = "white";
                                      button.style.color = "rgb(82, 139, 204)";
                                    });

                                    this.changeButtonTheme(e.currentTarget);

                                    this.setState({
                                      modalInputValue: 500
                                    });
                                  }}
                                >
                                  500
                                </Button>
                                <Button
                                  size="xl"
                                  style={{ margin: "0 3px" }}
                                  className="button-for-payment"
                                  level={"outline"}
                                  onClick={e => {
                                    const buttons = document.getElementsByClassName(
                                      "button-for-payment"
                                    );

                                    Array.from(buttons).forEach(button => {
                                      button.style.backgroundColor = "white";
                                      button.style.color = "rgb(82, 139, 204)";
                                    });

                                    this.changeButtonTheme(e.currentTarget);

                                    this.setState({
                                      modalInputValue: 1000
                                    });
                                  }}
                                >
                                  1000
                                </Button>
                              </Div>
                            }
                            actions={[
                              {
                                title: "Оформить",
                                type: "primary",
                                action: () => {
                                  const sum = this.state.modalInputValue;

                                  if (!sum) {
                                    return;
                                  }

                                  setModal(null);
                                  this.setState({
                                    modalInputValue: ""
                                  });

                                  const objectToPost = {
                                    user_id: this.state.userId,
                                    sum: parseInt(sum),
                                    own: true,
                                    subscription: true
                                  };

                                  const query = Object.keys(objectToPost)
                                    .map(function(k) {
                                      return (
                                        encodeURIComponent(k) +
                                        "=" +
                                        encodeURIComponent(objectToPost[k])
                                      );
                                    })
                                    .join("&");

                                  fetch(
                                    `https://niksavilov.pythonanywhere.com/api/donations/new/?${query}`
                                  )
                                    .then(response => response.clone().json())
                                    .then(res => {
                                      this.setState({
                                        money: sum,
                                        isSubscribed: true
                                      });
                                    });
                                }
                              }
                            ]}
                          />
                        </ModalRoot>
                      );
                    }}
                  >
                    <div className="main-page__recommended-challenge-title">
                      Оформить пожертвование
                    </div>
                  </Div>
                )}
                {Boolean(
                  this.state.recommendedChallenges &&
                    this.state.recommendedChallenges.length
                )
                  ? this.state.recommendedChallenges.map((challenge, key) => {
                      return (
                        <Div
                          className="main-page__recommended-challenge"
                          key={key}
                          onClick={() => {
                            setModal(
                              <ModalRoot
                                activeModal={"add-recommended-challenge"}
                              >
                                <ModalCard
                                  id="add-recommended-challenge"
                                  onClose={() => setModal(null)}
                                  icon={<ChallengeIcon />}
                                  title={challenge.title}
                                  caption={
                                    <div>
                                      <div
                                        style={{
                                          fontSize: "16px",
                                          fontWeight: "900"
                                        }}
                                      >
                                        {challenge.days} дней
                                      </div>
                                      <br />
                                      {challenge.description}
                                    </div>
                                  }
                                  actions={[
                                    {
                                      title: "Принять и поделиться",
                                      type: "primary",
                                      action: () => {
                                        setModal(null);
                                        this.setState({
                                          challenges: [
                                            ...this.state.challenges,
                                            { ...challenge, completed: false }
                                          ],
                                          recommendedChallenges: this.state.recommendedChallenges.filter(
                                            item => {
                                              return item.id !== challenge.id;
                                            }
                                          )
                                        });

                                        const objectToPost = {
                                          user_id: this.state.userId,
                                          challenge_id: challenge.id
                                        };

                                        const query = Object.keys(objectToPost)
                                          .map(function(k) {
                                            return (
                                              encodeURIComponent(k) +
                                              "=" +
                                              encodeURIComponent(
                                                objectToPost[k]
                                              )
                                            );
                                          })
                                          .join("&");

                                        fetch(
                                          `https://niksavilov.pythonanywhere.com/api/challenges/choose/?${query}`
                                        ).then(response =>
                                          response.clone().json()
                                        );
                                        connect.send("VKWebAppShare", {
                                          link: "vk.com/app5727453_-49894129"
                                        });
                                      }
                                    }
                                  ]}
                                />

                                <ModalCard
                                  id="subscribe"
                                  onClose={() => setModal(null)}
                                  icon={<Icon56MoneyTransferOutline />}
                                  title="Подписка"
                                  caption={
                                    <Textarea
                                      placeholder="Введите ежемесячную сумму"
                                      value={this.state.modalInputValue}
                                      onChange={e => {
                                        this.setState({
                                          modalInputValue: e.currentTarget.value
                                        });
                                      }}
                                      type="number"
                                    />
                                  }
                                  actions={[
                                    {
                                      title: "Оформить",
                                      type: "primary",
                                      action: () => {
                                        const sum = this.state.modalInputValue;

                                        if (!sum) {
                                          return;
                                        }

                                        setModal(null);
                                        this.setState({
                                          modalInputValue: ""
                                        });

                                        const objectToPost = {
                                          user_id: this.state.userId,
                                          sum: parseInt(sum),
                                          own: true,
                                          subscription: true
                                        };

                                        const query = Object.keys(objectToPost)
                                          .map(function(k) {
                                            return (
                                              encodeURIComponent(k) +
                                              "=" +
                                              encodeURIComponent(
                                                objectToPost[k]
                                              )
                                            );
                                          })
                                          .join("&");

                                        fetch(
                                          `https://niksavilov.pythonanywhere.com/api/donations/new/?${query}`
                                        )
                                          .then(response =>
                                            response.clone().json()
                                          )
                                          .then(res => {
                                            this.setState({
                                              money: sum,
                                              isSubscribed: true
                                            });
                                          });
                                      }
                                    }
                                  ]}
                                />
                              </ModalRoot>
                            );
                          }}
                        >
                          <div className="main-page__recommended-challenge-title">
                            {challenge.title}
                          </div>
                          <div className="main-page__recommended-challenge-value">
                            <div>{`-${challenge.diffRiskValue}%`}</div>от риска
                          </div>
                        </Div>
                      );
                    })
                  : "К сожалению, мы не смогли подобрать для Вас новые челенджи."}
              </Div>
            </Div>
          </Div>
        </Div>
      </Panel>
    );
  }
}

MainPage.propTypes = {
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired,
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    city: PropTypes.shape({
      title: PropTypes.string
    })
  }),
  answers: PropTypes.object
};
