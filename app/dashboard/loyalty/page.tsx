'use client'

import { motion } from 'framer-motion'
import { DuoCard } from '@/components/ui/duo-card'
import { DuoButton } from '@/components/ui/duo-button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { XPBadge } from '@/components/ui/xp-badge'
import { StreakCounter } from '@/components/ui/streak-counter'
import { useLoyalty, useRedeemReward } from '@/lib/hooks/use-loyalty'

export default function LoyaltyPage() {
  const { data: loyaltyData, isLoading } = useLoyalty()
  const redeemReward = useRedeemReward()

  // Default values while loading or if no data
  const points = loyaltyData?.points || 0
  const level = loyaltyData?.level || 1
  const streak = loyaltyData?.streak || 0
  const nextReward = loyaltyData?.next_reward || (level + 1) * 100
  const badges = loyaltyData?.badges || []
  const rewards = loyaltyData?.rewards || []

  const progressToNextReward = nextReward > 0 ? (points / nextReward) * 100 : 0

  const handleRedeem = async (rewardPoints: number) => {
    try {
      await redeemReward.mutateAsync(rewardPoints)
      alert('Reward redeemed successfully! 🎉')
    } catch (error) {
      console.error('Failed to redeem reward:', error)
      alert('Failed to redeem reward. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-duo-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-duo-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-duo-darkGray">Loading loyalty data...</p>
        </div>
      </div>
    )
  }

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
                  {points}
                </div>
                <div className="text-sm font-bold text-gray-600">Total Points</div>
              </div>
            </DuoCard>

            <DuoCard>
              <div className="text-center">
                <div className="text-6xl mb-3">🏆</div>
                <div className="text-4xl font-extrabold text-duo-yellow mb-2">
                  Level {level}
                </div>
                <div className="text-sm font-bold text-gray-600">Your Level</div>
              </div>
            </DuoCard>

            <DuoCard>
              <div className="text-center">
                <div className="text-6xl mb-3">🔥</div>
                <div className="text-4xl font-extrabold text-duo-error mb-2">
                  {streak}
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
                {nextReward - points} points to go!
              </span>
            </div>
            <ProgressBar progress={progressToNextReward} color="green" />
          </DuoCard>
        </div>

        {/* Badges */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-duo-darkGray mb-6">🎖️ Your Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {badges.length > 0 ? (
              badges.map((badge: any, index: number) => (
                <motion.div
                  key={badge.id || index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DuoCard className={`text-center ${!badge.unlocked ? 'opacity-50 grayscale' : ''}`}>
                    <div className="text-5xl mb-3">{badge.emoji || '🏆'}</div>
                    <div className="text-sm font-bold text-duo-darkGray">{badge.name}</div>
                    {badge.unlocked && (
                      <div className="mt-2 text-xs font-bold text-duo-success">✅ Unlocked</div>
                    )}
                    {!badge.unlocked && (
                      <div className="mt-2 text-xs font-bold text-gray-400">🔒 Locked</div>
                    )}
                  </DuoCard>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">No badges yet. Keep ordering to unlock them!</p>
              </div>
            )}
          </div>
        </div>

        {/* Available Rewards */}
        <div>
          <h2 className="text-2xl font-extrabold text-duo-darkGray mb-6">🎁 Redeem Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rewards.length > 0 ? (
              rewards.map((reward: any, index: number) => (
                <motion.div
                  key={reward.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DuoCard>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{reward.emoji || '🎁'}</div>
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
                        variant={points >= reward.points ? 'success' : 'secondary'}
                        disabled={points < reward.points || redeemReward.isPending}
                        size="md"
                        onClick={() => handleRedeem(reward.points)}
                      >
                        {redeemReward.isPending ? '⏳' : points >= reward.points ? '✅ Redeem' : '🔒 Locked'}
                      </DuoButton>
                    </div>
                  </DuoCard>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">No rewards available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
