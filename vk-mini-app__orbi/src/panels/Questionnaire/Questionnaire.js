import React from "react";
import PropTypes from "prop-types";
import { Panel, PanelHeader } from "@vkontakte/vkui";
import Div from "@vkontakte/vkui/dist/components/Div/Div";
import Button from "@vkontakte/vkui/dist/components/Button/Button";
import { ArrowIcon } from "../../icons/ArrowIcon";
import Input from "@vkontakte/vkui/dist/components/Input/Input";
import { BeatLoader } from "react-spinners";

import "./Questionnaire.css";

const questions = [
  {
    id: 1,
    text: "Вы курили  в течение последнего года?",
    options: [
      { text: "Постоянно", value: 2 },
      { text: "Редко", value: 1 },
      { text: "Нет", value: 0 }
    ],
    input: null
  },
  {
    id: 2,
    text: "Укажите пол",
    options: [{ text: "Мужской", value: 0 }, { text: "Женский", value: 1 }],
    input: null
  },
  {
    id: 3,
    text: "Сколько Вам лет?",
    options: null,
    input: {
      type: "number",
      placeholder: "Введите Ваш возраст",
      getValue: age => {
        if (age > 75) {
          return 3;
        } else if (age > 60) {
          return 2;
        } else if (age > 50) {
          return 1;
        } else if (age > 40) {
          return 0.2;
        } else {
          return 0;
        }
      }
    }
  },
  {
    id: 4,
    text: "Укажите Ваш вес",
    options: null,
    input: {
      type: "number",
      placeholder: "Введите Ваш вес в кг",
      getValue: () => {
        return 0;
      }
    }
  },
  {
    id: 5,
    text: "Какой у Вас рост?",
    options: null,
    input: {
      type: "number",
      placeholder: "Введите Ваш рост в см",
      getValue: (height, questionNumber) => {
        const weight = answers[questionNumber - 1].value;

        const BMI = weight / ((height / 100) * (height / 100));

        if (BMI > 40) {
          return 1.5;
        } else if (BMI > 35) {
          return 1;
        } else if (BMI > 30) {
          return 0.5;
        } else if (BMI > 25) {
          return 0.25;
        } else {
          return 0;
        }
      }
    }
  },
  {
    id: 6,
    text: "У вас есть сердечно-сосудистые заболевания?",
    options: [
      { text: "Да, несколько", value: 4 },
      { text: "Да, одно", value: 2 },
      { text: "Нет", value: 0 }
    ],
    input: null
  },
  {
    id: 7,
    text: "Вы занимаетесь физической активностью хотя бы 2,5 часа в неделю?",
    options: [{ text: "Да", value: 0 }, { text: "Нет", value: 1.5 }],
    input: null
  },
  {
    id: 8,
    text: "Вы съедаете 250 грамм овощей или фруктов в день?",
    options: [{ text: "Да", value: 0 }, { text: "Нет", value: 1.5 }],
    input: null
  },
  {
    id: 9,
    text: "Вы испытывали значительный стресс в течение последнего года?",
    options: [{ text: "Да", value: 1 }, { text: "Нет", value: 0 }],
    input: null
  }
];

export const maxRiskValue = 15.5;

export const getProperPercentage = value => {
  return (value * 0.3).toFixed(2);
};

let answers = [];

export class Questionnaire extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questions,
      questionNumber: 0,
      inputValue: "",
      percentage: 0,
      riskValue: 0,
      lastChosenOption: {
        questionNumber: -1,
        value: 0
      },
      isLoading: false
    };
  }

  calculatePercentage = ({
    question,
    questionNumber,
    option = null,
    value
  }) => {
    let curRiskValue = this.state.riskValue;
    const lastChosenOption = this.state.lastChosenOption;

    const valueToAdd = option
      ? option.value
      : question.input.getValue(value, questionNumber);

    if (lastChosenOption.questionNumber === questionNumber) {
      curRiskValue -= lastChosenOption.value;
    }

    if (option) {
      curRiskValue = curRiskValue + valueToAdd;
    } else {
      curRiskValue = curRiskValue + valueToAdd;
    }

    this.setState({
      percentage: getProperPercentage(
        Math.floor((curRiskValue / maxRiskValue) * 100)
      ),
      riskValue: curRiskValue,
      lastChosenOption: {
        questionNumber,
        value: valueToAdd
      }
    });
  };

  getAnswerObjectForPost = user_id => {
    const smoked = answers[0].value.value;
    const gender = answers[1].value.text === "Мужской" ? "male" : "female";
    const years = answers[2].value;
    const weight = answers[3].value;
    const height = answers[4].value;
    const heart_disease = answers[5].value.value / 2;
    const do_sports = answers[6].value.text === "Да" ? 1 : 0;
    const eat_fruits = answers[7].value.text === "Да" ? 1 : 0;
    const stress = answers[8].value.text === "Да" ? 1 : 0;

    return {
      vk_id: user_id,
      weight,
      height,
      mass_index: (weight / ((height / 100) * (height / 100))).toFixed(2),
      years,
      gender,
      smoked, //0 1 2
      heart_disease, //0 1 2
      do_sports, //true false
      eat_fruits, //true false
      stress, //true false
      risk: this.state.riskValue,
      diff_risk: 0.0
    };
  };

  render() {
    const { questions = [null], questionNumber = 0, percentage } = this.state;
    const currentQuestion = questions[questionNumber];
    const buttonTitle =
      questionNumber !== questions.length - 1 ? "Дальше" : "Закончить";
    const currentQuestionId = currentQuestion.id;

    const borderColor = `rgb(${percentage / 0.31}%, ${100 -
      percentage / 0.31}%, 65%)`;

    return (
      <Panel id={this.props.id}>
        <PanelHeader />
        {!this.state.isLoading ? (
          <Div className="questionnaire">
            <Div className="questionnaire__diagram-wrapper">
              <Div
                className="questionnaire__diagram"
                style={{ borderColor }}
              >{`${percentage}%`}</Div>
            </Div>
            <Div className="questionnaire__question">
              {currentQuestion.text}
            </Div>
            {currentQuestion.options ? (
              <Div className="questionnaire__options">
                {currentQuestion.options.map((option, index) => {
                  return (
                    <Div
                      className="questionnaire__option"
                      key={index}
                      onClick={e => {
                        answers[questionNumber] = {
                          id: currentQuestionId,
                          value: option
                        };

                        this.calculatePercentage({
                          option,
                          question: currentQuestion,
                          questionNumber
                        });

                        const elements = document.getElementsByClassName(
                          "questionnaire__option-active"
                        );

                        elements.length &&
                          Array.from(elements).forEach(element => {
                            element.classList.remove(
                              "questionnaire__option-active"
                            );
                          });

                        if (
                          !e.currentTarget.classList.contains(
                            "questionnaire__option-active"
                          )
                        ) {
                          e.currentTarget.classList.add(
                            "questionnaire__option-active"
                          );
                        }
                      }}
                    >
                      <span className="questionnaire__option-text">
                        {option.text}
                      </span>
                    </Div>
                  );
                })}
              </Div>
            ) : (
              <Div className="questionnaire__input">
                <Input
                  type="number"
                  placeholder={currentQuestion.input.placeholder}
                  value={this.state.inputValue || ""}
                  alignment="center"
                  onChange={event => {
                    const initVal = event.currentTarget.value;

                    let value = parseInt(initVal.replace(/\D+/g, "")) || "0";

                    if (value > 1000) {
                      value = value % 1000;
                    }

                    if (
                      value.toString()[0] === "0" &&
                      value.toString().length > 1
                    ) {
                      value = value
                        .toString()
                        .split("")
                        .slice(1)
                        .join("");
                    }

                    answers[questionNumber] = {
                      id: currentQuestionId,
                      value: value
                    };

                    this.calculatePercentage({
                      question: currentQuestion,
                      questionNumber,
                      value
                    });

                    this.setState({ inputValue: value });
                  }}
                />
              </Div>
            )}

            <Div className="questionnaire__control">
              <Button
                size="xl"
                level="2"
                onClick={async event => {
                  if (!answers[questionNumber]) {
                    return;
                  }

                  this.setState({ inputValue: "" });

                  const elements = document.getElementsByClassName(
                    "questionnaire__option-active"
                  );

                  elements.length &&
                    Array.from(elements).forEach(element => {
                      element.classList.remove("questionnaire__option-active");
                    });

                  if (questionNumber !== questions.length - 1) {
                    this.setState({ questionNumber: questionNumber + 1 });
                  } else {
                    const userId = this.props.fetchedUser
                      ? this.props.fetchedUser.id
                      : Math.floor(Math.random() * 1000000000);
                    const answerObjectForPost = this.getAnswerObjectForPost(
                      userId
                    );

                    const query = Object.keys(answerObjectForPost)
                      .map(function(k) {
                        return (
                          encodeURIComponent(k) +
                          "=" +
                          encodeURIComponent(answerObjectForPost[k])
                        );
                      })
                      .join("&");

                    this.setState({ isLoading: true });

                    await new Promise(resolve => setTimeout(resolve, 7000));

                    await fetch(
                      `https://niksavilov.pythonanywhere.com/api/customers/new/?${query}`
                    );

                    await fetch(
                      `https://niksavilov.pythonanywhere.com/api/customers/get_main_page/?user_id=${userId}`
                    )
                      .then(response => {
                        if (response.status !== 200) {
                          return Promise.reject();
                        }
                        return response.clone().json();
                      })
                      .then(customer => {
                        answers = [];
                        this.props.go(event, customer);
                      });

                    this.setState({ isLoading: false });
                  }
                }}
                data-to="main"
                className="questionnaire__control-button"
              >
                <div style={{ marginBottom: "10px", color: "white" }}>
                  {buttonTitle}
                </div>
                <ArrowIcon />
              </Button>
            </Div>
          </Div>
        ) : (
          <Div className="loading">
            <Div className="loading__header">
              <h1>
                Мы помогаем Вам заводить и поддерживать привычки, снижающие риск
                инсульта.
              </h1>
            </Div>

            <Div className="loading__main">
              <div>
                На основе Ваших факторов риска мы предложим вам задания,
                направленные на профилактику инсульта.
              </div>
              <BeatLoader color="white" />
            </Div>
          </Div>
        )}
      </Panel>
    );
  }
}

Questionnaire.propTypes = {
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired
};
