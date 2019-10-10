import * as React from 'react';

import { rusLettersArray, RusLetter, rusLetters } from './rusToPol';
import styled, { createGlobalStyle, css } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap&subset=cyrillic');

  body {
    font-family: 'Roboto', sans-serif;
  }

  *, *:before, *:after {
    box-sizing: border-box;
  }
`;

const getRandomRusLetter = (letters: RusLetter[]): RusLetter => {
  const index = Math.floor(Math.random() * letters.length);
  return letters[index];
};

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
const Question = styled.div`
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
  const [question, setQuestion] = React.useState<RusLetter | undefined>();
  const [answers, setAnswers] = React.useState<{ answer: RusLetter; order: number }[]>([]);
  const [selectedAnswer, setSelectedAnswer] = React.useState<RusLetter | undefined>(undefined);
  const [score, setScore] = React.useState(0);

  const nextQuestion = () => {
    const newQuestion = getRandomRusLetter(rusLettersArray);
    const answersStack = [newQuestion];

    for (let i = 0; i < NR_OF_ANSWERS - 1; i++) {
      const otherLetters = rusLettersArray.filter(
        l => !answersStack.map(a => a.letter).includes(l.letter) && !answersStack.map(a => a.pol).includes(l.pol),
      );
      answersStack.push(getRandomRusLetter(otherLetters));
    }

    const newAnswers = answersStack.map(a => ({
      answer: rusLetters[a.letter],
      order: Math.floor(Math.random() * NR_OF_ANSWERS * 2),
    }));

    setQuestion(newQuestion);
    setAnswers(newAnswers);
    setSelectedAnswer(undefined);
  };

  React.useEffect(() => {
    nextQuestion();
  }, []);

  const handleAnswerClick = (answer: RusLetter) => {
    if (!selectedAnswer && !!question) {
      const isCorrect = answer.letter === question.letter;

      if (isCorrect) {
        setScore(prev => prev + 10);
      } else {
        setScore(prev => (prev > 20 ? prev - 20 : 0));
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
            <Question>{question.letter}</Question>
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
