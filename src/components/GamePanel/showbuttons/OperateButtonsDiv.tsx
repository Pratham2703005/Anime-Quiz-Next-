import { useGameStore } from '@/store/gameStore'
import NextButton from './NextButton'
import QuitButton from './QuitButton'


const OperateButtonsDiv = ({selectedAnswer,handleNextQuestion,showNextButton}) => {
  const {currentQuestionIndex} = useGameStore((s)=>s);
  return (
    <div className='relative w-full flex justify-between'>
      <div>
        {currentQuestionIndex !== 0 && selectedAnswer===null && (
          <QuitButton />
        )}
      </div>
      <div>
        {showNextButton && (
          <NextButton handleNextQuestion={handleNextQuestion} />
        )}
      </div>
        
    </div>
  )
}

export default OperateButtonsDiv
