import { Compass, CloudRain, Zap, Eye, Wind, Shield, Target, FlaskConical, Users, Siren, type LucideIcon } from 'lucide-react'
import type { ModuleIcon } from '../content/types'

export const MODULE_ICONS: Record<ModuleIcon, LucideIcon> = {
  compass: Compass,
  'cloud-rain': CloudRain,
  zap: Zap,
  eye: Eye,
  wind: Wind,
  shield: Shield,
  target: Target,
  flask: FlaskConical,
  users: Users,
  siren: Siren,
}
