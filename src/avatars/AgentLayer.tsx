import { AGENTS, OWNER } from '../data/worldData'
import { AgentAvatar } from './AgentAvatar'

/** All 7 characters: the 6 agents plus the owner. No other logic. */
export function AgentLayer() {
  return (
    <group>
      {AGENTS.map((def) => (
        <AgentAvatar key={def.id} def={def} isOwner={false} />
      ))}
      <AgentAvatar def={OWNER} isOwner />
    </group>
  )
}

export default AgentLayer
