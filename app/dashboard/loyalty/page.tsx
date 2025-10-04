'use client'

import { motion } from 'framer-motion'
import { DuoCard } from '@/components/ui/duo-card'
import { DuoButton } from '@/components/ui/duo-button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { XPBadge } from '@/components/ui/xp-badge'
import { StreakCounter } from '@/components/ui/streak-counter'

export default function LoyaltyPage() {
  // Mock data - will connect to backend
  const loyaltyData = {
    points: 1250,
    level: 5,
    streak: 12,
    nextReward: 1500,
    badges: [
      { id: 1, name: 'First Order', emoji: '🎉', unlocked: true },
      { id: 2, name: '10 Orders', emoji: '🔥', unlocked: true },
      { id: 3, name: 'Week Streak', emoji: '⚡', unlocked: true },
      { id: 4, name: 'VIP Member', emoji: '👑', unlocked: false },
      { id: 5, name: 'Master Chef', emoji: '👨‍🍳', unlocked: false },
    ],
    rewards: [
      { id: 1, name: 'Free Appetizer', points: 500, emoji: '🥗' },
      { id: 2, name: '10% Off Next Order', points: 750, emoji: '💰' },
      { id: 3, name: 'Free Dessert', points: 1000, emoji: '🍰' },
      { id: 4, name: 'VIP Table Reservation', points: 2000, emoji: '⭐' },
    ],
  }

  const progressToNextReward = (loyaltyData.points / loyaltyData.nextReward) * 100

  return (
    <div className="min-h-screen bg-duo-gray p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">🏆</div>
            <div>
              <h1 className="text-4xl font-extrabold text-duo-darkGray">Loyalty & Rewards</h1>
              <p className="text-lg text-gray-600">Earn points, unlock rewards!</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <DuoCard>
              <div className="text-center">
                <div className="text-6xl mb-3">⚡</div>
                <div className="text-4xl font-extrabold text-duo-green mb-2">
                  {loyaltyData.points}
                </div>
                <div className="text-sm font-bold text-gray-600">Total Points</div>
              </div>
            </DuoCard>

            <DuoCard>
              <div className="text-center">
                <div className="text-6xl mb-3">🏆</div>
                <div className="text-4xl font-extrabold text-duo-yellow mb-2">
                  Level {loyaltyData.level}
                </div>
                <div className="text-sm font-bold text-gray-600">Your Level</div>
              </div>
            </DuoCard>

            <DuoCard>
              <div className="text-center">
                <div className="text-6xl mb-3">🔥</div>
                <div className="text-4xl font-extrabold text-duo-error mb-2">
                  {loyaltyData.streak}
                </div>
                <div className="text-sm font-bold text-gray-600">Day Streak</div>
              </div>
            </DuoCard>
          </div>

          {/* Progress to Next Reward */}
          <DuoCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-extrabold text-duo-darkGray">Next Reward</h3>
              <span className="text-sm font-bold text-gray-600">
                {loyaltyData.nextReward - loyaltyData.points} points to go!
              </span>
            </div>
            <ProgressBar progress={progressToNextReward} color="green" />
          </DuoCard>
        </div>

        {/* Badges */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-duo-darkGray mb-6">🎖️ Your Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {loyaltyData.badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <DuoCard className={`text-center ${!badge.unlocked ? 'opacity-50 grayscale' : ''}`}>
                  <div className="text-5xl mb-3">{badge.emoji}</div>
                  <div className="text-sm font-bold text-duo-darkGray">{badge.name}</div>
                  {badge.unlocked && (
                    <div className="mt-2 text-xs font-bold text-duo-success">✅ Unlocked</div>
                  )}
                  {!badge.unlocked && (
                    <div className="mt-2 text-xs font-bold text-gray-400">🔒 Locked</div>
                  )}
                </DuoCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Available Rewards */}
        <div>
          <h2 className="text-2xl font-extrabold text-duo-darkGray mb-6">🎁 Redeem Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loyaltyData.rewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DuoCard>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{reward.emoji}</div>
                      <div>
                        <h3 className="text-xl font-extrabold text-duo-darkGray">
                          {reward.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {reward.points} points
                        </p>
                      </div>
                    </div>
                    <DuoButton
                      variant={loyaltyData.points >= reward.points ? 'success' : 'secondary'}
                      disabled={loyaltyData.points < reward.points}
                      size="md"
                    >
                      {loyaltyData.points >= reward.points ? '✅ Redeem' : '🔒 Locked'}
                    </DuoButton>
                  </div>
                </DuoCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
