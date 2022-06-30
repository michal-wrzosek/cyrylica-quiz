import React, { useState } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import { repeat } from 'rambda';

import { rusLettersArray, RusLetter, rusLetters } from './rusToPol';

type FailureLevel = { [rusLetter: string]: number };
type CommonMistakes = { [rusLetter: string]: RusLetter[] };
enum Languages {
  EN = 'EN',
  PL = 'PL',
}

const getRandomRusLetter = (rusLettersArray: RusLetter[], failureLevel: FailureLevel): RusLetter => {
  const rusLettersMultipliedByFailureLevel = rusLettersArray.reduce<RusLetter[]>((sum, rusLetter) => {
    const timesToRepeat = failureLevel[rusLetter.letter];
    return [...sum, ...repeat(rusLetter)(timesToRepeat)];
  }, []);

  const index = Math.floor(Math.random() * rusLettersMultipliedByFailureLevel.length);
  return rusLettersMultipliedByFailureLevel[index];
};

const FAILURE_LEVEL_FAILURE_PENALTY = 9;
const FAILURE_LEVEL_COMMON_MISTAKE_PENALTY = FAILURE_LEVEL_FAILURE_PENALTY * 5;
const FAILURE_LEVEL_SUCCESS_REWARD = 3;
const FAILURE_LEVEL_MIN = 1;
const FAILURE_LEVEL_INITIAL = 3;

const getInitialFailureLevel = (): FailureLevel =>
  Object.values(rusLetters).reduce((sum, { letter }) => ({ ...sum, [letter]: FAILURE_LEVEL_INITIAL }), {});

const getNewFailureLevelOnSuccess =
  (rusLetter: RusLetter) =>
  (previousFailureLevel: FailureLevel): FailureLevel => ({
    ...previousFailureLevel,
    [rusLetter.letter]: Math.max(
      previousFailureLevel[rusLetter.letter] - FAILURE_LEVEL_SUCCESS_REWARD,
      FAILURE_LEVEL_MIN,
    ),
  });

const getNewFailureLevelOnFailure =
  (rusLetter: RusLetter) =>
  (previousFailureLevel: FailureLevel): FailureLevel => ({
    ...previousFailureLevel,
    [rusLetter.letter]: previousFailureLevel[rusLetter.letter] + FAILURE_LEVEL_FAILURE_PENALTY,
  });

const getInitialCommonMistakes = (): CommonMistakes =>
  Object.values(rusLetters).reduce((sum, { letter }) => ({ ...sum, [letter]: [] }), {});

const getNewCommonMistakes =
  (question: RusLetter, answer: RusLetter) =>
  (previousCommonMistakes: CommonMistakes): CommonMistakes => ({
    ...previousCommonMistakes,
    [question.letter]: [...previousCommonMistakes[question.letter], answer],
  });

/** This allow us to confuse user more by showing him answers with his common mistakes for that question */
const getFailureLevelAdjustedWithQuestionCommonMistakes = (
  question: RusLetter,
  previousFailureLevel: FailureLevel,
  commonMistakes: CommonMistakes,
) =>
  commonMistakes[question.letter].reduce(
    (sum, mistake) => ({
      ...sum,
      [mistake.letter]: previousFailureLevel[mistake.letter] + FAILURE_LEVEL_COMMON_MISTAKE_PENALTY,
    }),
    previousFailureLevel,
  );

const GlobalStyles = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
  }

  *, *:before, *:after {
    box-sizing: border-box;
  }
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  color: #171717;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.5s ease;
  line-height: 1;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const NextLetterButton = styled(Button)``;
const ButtonsSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;
interface AnswerProps {
  isCorrect: boolean;
  isSelected: boolean;
  showResults: boolean;
  order: number;
}
const Answer = styled(Button)<AnswerProps>`
  width: 70px;
  height: 70px;
  margin: 0 10px;
  order: ${({ order }) => order};
  text-align: center;

  ${({ isCorrect, showResults }) =>
    showResults &&
    isCorrect &&
    css`
      background-color: #b4ff7b;

      &:hover {
        background-color: #b4ff7b;
      }
    `};

  ${({ isCorrect, isSelected, showResults }) =>
    showResults &&
    isSelected &&
    !isCorrect &&
    css`
      background-color: #ff9f9f;

      &:hover {
        background-color: #ff9f9f;
      }
    `};
`;
const Answers = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;
const QuestionLetterCursive = styled.span`
  font-family: 'Marck Script', cursive;
`;
const QuestionLetterSerif = styled.span`
  font-family: 'Roboto Slab', serif;
`;
const QuestionLetterSansSerif = styled.span`
  font-family: 'Roboto', sans-serif;
`;
const Question = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  margin-top: 20px;
  text-align: center;
`;
const SubHeader = styled.div`
  font-size: 12px;
  text-align: center;
  margin-top: 20px;
`;
const Header = styled.div`
  font-size: 20px;
  text-align: center;
`;
const ScoreLabel = styled.div`
  font-size: 12px;
  text-align: center;
`;
const ScoreValue = styled.div`
  font-size: 18px;
  text-align: center;
`;
const Score = styled.div`
  padding: 20px;
  position: absolute;
  top: 20px;
  right: 20px;
  border: 1px solid black;
  border-radius: 8px;
`;
const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

export const Quiz = () => {
  const NR_OF_ANSWERS = 5;
  const [question, setQuestion] = useState<RusLetter | undefined>();
  const [answers, setAnswers] = useState<{ answer: RusLetter; order: number }[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<RusLetter | undefined>(undefined);
  const [score, setScore] = useState(0);
  const [failureLevel, setFailureLevel] = useState(getInitialFailureLevel());
  const [commonMistakes, setCommonMistakes] = useState(getInitialCommonMistakes());

  const nextQuestion = () => {
    const newQuestion = getRandomRusLetter(rusLettersArray, failureLevel);
    const answersStack = [newQuestion];

    for (let i = 0; i < NR_OF_ANSWERS - 1; i++) {
      const otherLetters = rusLettersArray.filter(
        (l) => !answersStack.map((a) => a.letter).includes(l.letter) && !answersStack.map((a) => a.pol).includes(l.pol),
      );
      answersStack.push(
        getRandomRusLetter(
          otherLetters,
          getFailureLevelAdjustedWithQuestionCommonMistakes(newQuestion, failureLevel, commonMistakes),
        ),
      );
    }

    const newAnswers = answersStack.map((a) => ({
      answer: rusLetters[a.letter],
      order: Math.floor(Math.random() * NR_OF_ANSWERS * 2),
    }));

    setQuestion(newQuestion);
    setAnswers(newAnswers);
    setSelectedAnswer(undefined);
  };

  React.useEffect(() => {
    nextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswerClick = (answer: RusLetter) => {
    if (!selectedAnswer && !!question) {
      const isCorrect = answer.letter === question.letter;

      if (isCorrect) {
        setScore((prev) => prev + 10);
        setFailureLevel(getNewFailureLevelOnSuccess(question));
      } else {
        setScore((prev) => (prev > 20 ? prev - 20 : 0));
        setFailureLevel(getNewFailureLevelOnFailure(question));
        setCommonMistakes(getNewCommonMistakes(question, answer));
      }
      setSelectedAnswer(answer);
    }
  };
  const handleNextLetterButtonClick = () => nextQuestion();

  return (
    <React.Fragment>
      <GlobalStyles />
      <Wrapper>
        {question && (
          <React.Fragment>
            <SubHeader>Naucz się czytać cyrylicę - Quiz</SubHeader>
            <Header>Co znaczy ta litera?</Header>
            <Question>
              <QuestionLetterSansSerif>{question.letter}</QuestionLetterSansSerif>
              <QuestionLetterSerif>{question.letter}</QuestionLetterSerif>
              <QuestionLetterCursive>{question.letter}</QuestionLetterCursive>
            </Question>
            <Answers>
              {answers.map(({ answer, order }) => (
                <Answer
                  key={answer.letter}
                  isCorrect={answer.letter === question.letter}
                  isSelected={!!selectedAnswer && answer.letter === selectedAnswer.letter}
                  showResults={!!selectedAnswer}
                  onClick={() => handleAnswerClick(answer)}
                  order={order}
                >
                  {answer.pol}
                </Answer>
              ))}
            </Answers>
            {!!selectedAnswer && (
              <ButtonsSection>
                <NextLetterButton onClick={handleNextLetterButtonClick}>Następna litera</NextLetterButton>
              </ButtonsSection>
            )}
            <Score>
              <ScoreLabel>Wynik:</ScoreLabel>
              <ScoreValue>{score}</ScoreValue>
            </Score>
          </React.Fragment>
        )}
      </Wrapper>
    </React.Fragment>
  );
};
