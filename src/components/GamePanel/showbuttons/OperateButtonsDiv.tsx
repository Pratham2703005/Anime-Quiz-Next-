import { useGameStore } from '@/store/gameStore'
import NextButton from './NextButton'
import QuitButton from './QuitButton'


const OperateButtonsDiv = ({selectedAnswer,handleNextQuestion,showNextButton}) => {
  const {currentQuestionIndex} = useGameStore((s)=>s);
  return (
    <div className='absolute top-12 w-full'>
        {currentQuestionIndex !== 0 && selectedAnswer===null && (
          <QuitButton />
        )}
        {showNextButton && (
          <NextButton handleNextQuestion={handleNextQuestion} />
        )}
        
    </div>
  )
}

export default OperateButtonsDiv
