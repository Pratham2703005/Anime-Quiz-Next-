/* eslint-disable react-hooks/rules-of-hooks */
import { useRef } from 'react';

export const getDisabledOptions = (options, currentQuestion, activatedLifeline) => {
  const randomValueRef = useRef(null); // Store random value

  if (activatedLifeline === null) return [];

  const wrongAnswers = options.filter(
    (option) => option !== currentQuestion.correct_answer
  );

  let lifelineIndex = activatedLifeline;

  if (lifelineIndex === 2) {
    if (randomValueRef.current === null) {
      randomValueRef.current = Math.floor(Math.random() * 3);
    }
    lifelineIndex = randomValueRef.current;
  }

  const disabledOptions = new Array(options.length).fill(false);
  const disabledIndices = wrongAnswers.slice(0, 3 - lifelineIndex).map((wrong) =>
    options.indexOf(wrong)
  );

  disabledIndices.forEach((index) => {
    if (index !== -1) disabledOptions[index] = true;
  });

  return disabledOptions;
};
