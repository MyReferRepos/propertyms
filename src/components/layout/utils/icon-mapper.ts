/**
 * Icon Mapper
 * 图标映射工具 - 将字符串图标名称映射到实际的图标组件
 */

import {
  Construction,
  LayoutDashboard,
  Bug,
  FileX,
  Lock,
  ServerOff,
  UserX,
  ShieldCheck,
  Shield,
  Command,
  Layers,
  Users,
  User,
  UserCheck,
  Settings,
  Home,
  FileText,
  Database,
  Mail,
  Bell,
  Calendar,
  Clock,
  Search,
  Filter,
  Upload,
  Download,
  Share,
  Edit,
  Trash,
  Plus,
  Minus,
  Check,
  X,
  Menu,
  Circle,
  Folder,
  FolderOpen,
  FolderTree,
  ChevronRight,
  MoreHorizontal,
  Save,
  Copy,
  Eye,
  EyeOff,
  Star,
  Heart,
  Bookmark,
  Flag,
  Tag,
  Image,
  Video,
  Music,
  Paperclip,
  Link,
  ExternalLink,
  BarChart,
  PieChart,
  TrendingUp,
  Activity,
  Zap,
  Award,
  Gift,
  AlertTriangle,
  List,
  BookOpen,
  Code,
  AppWindow,
  // Business & Commerce
  Briefcase,
  Building,
  Building2,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  DollarSign,
  Package,
  Package2,
  Store,
  Wallet,
  Receipt,
  // Documents & Files
  Files,
  FilePlus,
  FileCheck,
  FileEdit,
  Archive,
  Inbox,
  FileCode,
  FileCog,
  // Tools & System
  Wrench,
  Hammer,
  Cpu,
  HardDrive,
  Server,
  MonitorSmartphone,
  Laptop,
  Smartphone,
  Tablet,
  // Communication
  MessageCircle,
  MessageSquare,
  MessagesSquare,
  Phone,
  PhoneCall,
  AtSign,
  Send,
  Reply,
  Forward,
  // Navigation & Arrows
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronsDown,
  ChevronsUp,
  CornerUpLeft,
  CornerUpRight,
  MoveHorizontal,
  MoveVertical,
  // Status & Alerts
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  HelpCircle,
  ShieldAlert,
  ShieldX,
  // UI Elements
  Grid,
  Grid3x3,
  Box,
  Square,
  Triangle,
  Hexagon,
  Layout,
  Columns,
  Rows,
  PanelLeft,
  PanelRight,
  // Media & Entertainment
  Camera,
  Mic,
  MicOff,
  Speaker,
  Volume,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Film,
  Headphones,
  // Map & Location
  Map,
  MapPin,
  Navigation,
  Compass,
  Globe,
  Globe2,
  MapPinned,
  // Security
  Key,
  Unlock,
  ShieldOff,
  Fingerprint,
  ScanFace,
  // Weather & Nature
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Snowflake,
  Wind,
  Droplets,
  // Connectivity
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothOff,
  Rss,
  Radio,
  Signal,
  Cast,
  // Power & Battery
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  Power,
  PowerOff,
  Plug,
  // Time & Date
  Timer,
  Hourglass,
  AlarmClock,
  CalendarDays,
  CalendarClock,
  // Social & People
  UserPlus,
  UserMinus,
  UsersRound,
  UserCog,
  Contact,
  // Text & Typography
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  // Shopping & Cart
  ShoppingBasket,
  // Additional Common Icons
  Sparkles,
  Target,
  TrendingDown,
  RefreshCw,
  RotateCw,
  Maximize,
  Minimize,
  Expand,
  Shrink,
  ZoomIn,
  ZoomOut,
  Settings2,
  Cog,
  type LucideIcon,
} from 'lucide-react'

/**
 * 图标映射表
 * 后端返回图标名称（字符串），前端映射到实际的图标组件
 */
const iconMap: Record<string, LucideIcon> = {
  // Dashboard & Layout
  LayoutDashboard,
  Home,
  Layers,
  Folder,
  FolderOpen,
  FolderTree,
  Layout,
  Columns,
  Rows,
  PanelLeft,
  PanelRight,

  // Users & Auth
  Users,
  User,
  UserCheck,
  UserPlus,
  UserMinus,
  UserX,
  UserCog,
  UsersRound,
  Contact,
  ShieldCheck,
  Shield,
  ShieldAlert,
  ShieldX,
  ShieldOff,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  ScanFace,

  // Settings & System
  Settings,
  Settings2,
  Cog,
  Command,
  Database,
  Menu,
  List,
  AppWindow,
  Server,
  Cpu,
  HardDrive,
  MonitorSmartphone,
  Laptop,
  Smartphone,
  Tablet,

  // Content & Files
  FileText,
  FileX,
  Files,
  FilePlus,
  FileCheck,
  FileEdit,
  FileCode,
  FileCog,
  Archive,
  Inbox,
  Image,
  Video,
  Music,
  Paperclip,
  BookOpen,
  Code,

  // Business & Commerce
  Briefcase,
  Building,
  Building2,
  ShoppingCart,
  ShoppingBag,
  ShoppingBasket,
  CreditCard,
  DollarSign,
  Package,
  Package2,
  Store,
  Wallet,
  Receipt,

  // Communication
  Mail,
  Bell,
  Link,
  ExternalLink,
  MessageCircle,
  MessageSquare,
  MessagesSquare,
  Phone,
  PhoneCall,
  AtSign,
  Send,
  Reply,
  Forward,

  // Time & Schedule
  Calendar,
  CalendarDays,
  CalendarClock,
  Clock,
  Timer,
  Hourglass,
  AlarmClock,

  // Actions
  Search,
  Filter,
  Upload,
  Download,
  Share,
  Edit,
  Trash,
  Plus,
  Minus,
  Check,
  X,
  Save,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  RotateCw,
  Maximize,
  Minimize,
  Expand,
  Shrink,
  ZoomIn,
  ZoomOut,

  // Navigation & Arrows
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronsDown,
  ChevronsUp,
  CornerUpLeft,
  CornerUpRight,
  MoveHorizontal,
  MoveVertical,

  // UI Elements
  Circle,
  Box,
  Square,
  Triangle,
  Hexagon,
  Grid,
  Grid3x3,
  MoreHorizontal,
  Star,
  Heart,
  Bookmark,
  Flag,
  Tag,

  // Status & Alerts
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,

  // Charts & Analytics
  BarChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,

  // Media & Entertainment
  Camera,
  Mic,
  MicOff,
  Speaker,
  Volume,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Film,
  Headphones,

  // Map & Location
  Map,
  MapPin,
  MapPinned,
  Navigation,
  Compass,
  Globe,
  Globe2,

  // Weather & Nature
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Snowflake,
  Wind,
  Droplets,

  // Connectivity
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothOff,
  Rss,
  Radio,
  Signal,
  Cast,

  // Power & Battery
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  Power,
  PowerOff,
  Plug,

  // Text & Typography
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,

  // Tools & System
  Wrench,
  Hammer,

  // Special
  Zap,
  Award,
  Gift,
  Sparkles,

  // Errors & Status
  Bug,
  Construction,
  ServerOff,

  // Aliases - Support backend icon names
  dashboard: LayoutDashboard,
  team: Users,
  safety: ShieldCheck,
  appstore: AppWindow,
  setting: Settings,
  permission: ShieldCheck,
  module: Box,
}

/**
 * 将字符串转换为 PascalCase 格式
 * @param str 输入字符串
 * @returns PascalCase 格式的字符串
 */
function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

/**
 * 根据图标名称获取图标组件
 * @param iconName 图标名称（字符串）
 * @returns 图标组件，如果未找到则返回默认图标 (Circle)
 */
export function getIconComponent(iconName?: string): LucideIcon | undefined {
  if (!iconName) return undefined

  // 移除可能的前缀和后缀（如 'lucide:', 'Icon' 等）
  let cleanName = iconName
    .replace(/^(lucide[-:]?)/i, '')
    .replace(/Icon$/i, '')
    .trim()

  // 转换为 PascalCase 以匹配 iconMap 的键
  const pascalName = toPascalCase(cleanName)

  // 查找图标（先尝试 PascalCase，再尝试原始名称）
  const icon = iconMap[pascalName] || iconMap[cleanName]

  // 如果找不到图标，在开发环境下输出警告
  if (!icon && import.meta.env.DEV) {
    console.warn(`[Icon Mapper] Icon "${iconName}" (cleaned: "${cleanName}", pascal: "${pascalName}") not found in iconMap. Using fallback Circle icon.`)
    console.log('[Icon Mapper] Available icons:', Object.keys(iconMap).join(', '))
  }

  // 返回找到的图标或默认的 Circle 图标
  return icon || Circle
}

/**
 * 批量映射图标
 * @param iconNames 图标名称数组
 * @returns 图标组件数组
 */
export function mapIcons(iconNames: (string | undefined)[]): (LucideIcon | undefined)[] {
  return iconNames.map(getIconComponent)
}

/**
 * 获取所有可用的图标名称
 * 用于文档和调试
 */
export function getAvailableIcons(): string[] {
  return Object.keys(iconMap).sort()
}
