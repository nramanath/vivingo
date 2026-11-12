import React from 'react';
import { useWhatsMissingLogic } from './useWhatsMissingLogic';
import {
  GameStartScreen,
  GameOverScreen,
  GameFeedbackBanner,
  GameInstructionPill,
} from '../shared';
import { WhatsMissingHud } from './WhatsMissingHud';
import { SceneTray } from './SceneTray';
import { MemorizeControls } from './MemorizeControls';
import { ChoiceGrid } from './ChoiceGrid';
import type { RoundPhase } from './whatsMissingReducer';
import type { Round } from './whatsMissingData';

function getInstruction(roundPhase: RoundPhase, round: Round): string {
  if (roundPhase === 'MEMORIZE') return 'Memorize the items! Press SPACE when ready.';
  if (roundPhase === 'COVERING') return 'Abracadabra...';
  return `Which item vanished? Press 1-${round.choices.length} or tap!`;
}

export const WhatsMissing: React.FC = () => {
  const game = useWhatsMissingLogic();
  const { phase, roundPhase, stage, score, round, feedback } = game;

  if (phase === 'START') {
    return (
      <GameStartScreen
        title="What's Missing?"
        icon="🎩"
        description="Look at the tray, then find the item that vanished!"
        onStart={game.startGame}
      />
    );
  }
  if (phase === 'WON') return <GameOverScreen score={score} onRestart={game.resetGame} />;
  if (!round) return null;

  const isMemorizing = roundPhase === 'MEMORIZE';
  const isCovered = isMemorizing || roundPhase === 'COVERING';
  const isRevealed = roundPhase === 'REVEALED';

  return (
    <div className="flex flex-col items-center w-full h-full p-4 relative animate-in fade-in duration-500">
      <GameFeedbackBanner feedback={feedback} className="!top-24" />
      <WhatsMissingHud stage={stage} score={score} />

      <div className="relative flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 z-20 gap-5 pb-16 overflow-y-auto">
        <div className="font-fredoka text-xl sm:text-2xl font-bold text-black/70 text-center">
          {round.theme.icon} {round.theme.prompt}
        </div>
        <SceneTray
          theme={round.theme}
          slots={isCovered ? round.tray : round.guessTray}
          revealedItem={isRevealed ? round.missingItem : undefined}
          showCurtain={roundPhase === 'COVERING'}
        />
        {isMemorizing && (
          <MemorizeControls progress={game.timeProgress} onReady={game.triggerCover} />
        )}
        {(roundPhase === 'GUESSING' || isRevealed) && (
          <ChoiceGrid
            choices={round.choices}
            disabledChoiceIds={game.disabledChoices}
            answerId={isRevealed ? round.missingItem.id : null}
            onChoose={game.handleChoice}
          />
        )}
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-30">
        <GameInstructionPill text={getInstruction(roundPhase, round)} isVisible={true} />
      </div>
    </div>
  );
};
