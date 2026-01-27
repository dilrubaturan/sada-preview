# Planning Guide

Sada is a mindful reflection companion that helps users reconnect with their core values through daily practices, personal wisdom collections, and guided introspection.

**Experience Qualities**:
1. **Contemplative** - The interface should feel like a sanctuary, providing space for thought without rushing or overwhelming the user
2. **Personal** - Every element should feel intimate and customized to the user's spiritual, philosophical, and emotional journey
3. **Nurturing** - The experience should gently guide users toward self-awareness and peace, offering support without judgment

**Complexity Level**: Light Application (multiple features with basic state)
This app combines several distinct but interconnected features (daily reflections, gratitude journal, library, notes) with persistent state management, but doesn't require complex workflows or multiple views that would push it into Complex Application territory.

## Essential Features

### Daily Reflection Prompt
- **Functionality**: Displays a curated reflection (quote, poem, verse, saying) based on user-selected categories
- **Purpose**: Provides a meaningful touchpoint to ground users in their values throughout the day
- **Trigger**: Automatically shown on app open, refreshable at any time
- **Progression**: App opens → Reflection displays → User can favorite/skip → Can explore similar reflections → Returns to main view
- **Success criteria**: Users engage with at least one reflection daily, favorites accumulate over time

### Silent Moment Reminder
- **Functionality**: Prompts user to pause and reflect on their day with a calm, focused interface
- **Purpose**: Creates intentional space for mindfulness and prevents mental clutter
- **Trigger**: Time-based suggestion or user-initiated
- **Progression**: Reminder appears → User acknowledges → Timer/quiet interface shown → Gentle completion
- **Success criteria**: Users complete silent moments without distraction, feel calmer afterward

### Gratitude Journal
- **Functionality**: Quick-entry journal for things users are grateful for each day
- **Purpose**: Cultivates positive mindset and helps users recognize daily blessings
- **Trigger**: User-initiated from main navigation
- **Progression**: Open journal → View past entries → Add new gratitude → Entry saved with timestamp
- **Success criteria**: Users can easily add entries, review history, and see patterns

### Day Notes (Liked/Upset)
- **Functionality**: Two-column note-taking for what brought joy and what caused distress
- **Purpose**: Externalizes emotions so users don't carry mental burden of remembering grievances
- **Trigger**: User-initiated from main navigation
- **Progression**: Open notes → View today's or past notes → Add to "liked" or "upset" columns → Notes saved
- **Success criteria**: Users feel relief from expressing upsets, can see patterns in what brings them joy

### Values Library
- **Functionality**: Personal collection of quotes, poems, Quranic verses, sayings, movie quotes, songs, personal notes organized by categories
- **Purpose**: Serves as a knowledge base of wisdom that resonates with the user's values
- **Trigger**: User adds content manually or from favorited daily reflections
- **Progression**: Navigate to library → Browse by category → View/edit/delete items → Add new items with custom text and category
- **Success criteria**: Library grows organically, becomes a personalized reference, feeds daily reflections

### Category Selection & Personalization
- **Functionality**: Users can select which types of reflections they want (philosophical, spiritual, historical, movies, personal notes, etc.)
- **Purpose**: Tailors the experience to user's interests and spiritual/intellectual preferences
- **Trigger**: Initial setup and adjustable in settings
- **Progression**: Select categories → Preferences saved → Daily reflections filtered → Adjust anytime
- **Success criteria**: Reflections feel personally relevant, users engage more with preferred categories

## Edge Case Handling
- **Empty Library**: Show onboarding message to add first values/quotes with direct link to library
- **No Daily Reflection Available**: Show welcome message encouraging user to build their library
- **First Time User**: Clean slate with empty states that guide user to add their first content
- **Multiple Days Without Entry**: Notes and gratitude sections only show entries when user actively adds them
- **Very Long Notes**: Graceful text truncation with expand option in journal views

## Design Direction
The design should evoke serenity, wisdom, and introspection—like opening a cherished book of personal philosophy. It should feel warm and grounded, with natural elements that suggest growth and reflection (like ripples in water, echoing the "Sada" resonance concept).

## Color Selection

**Primary Color**: Deep teal/cyan (`oklch(0.55 0.12 200)`) - Represents calm waters, depth of thought, and spiritual clarity. This color grounds the interface while maintaining warmth.

**Secondary Colors**: 
- Warm sand/beige (`oklch(0.88 0.02 80)`) - Evokes natural, earthy grounding and provides soft contrast
- Soft sage (`oklch(0.75 0.06 150)`) - Represents growth and renewal, used for positive actions

**Accent Color**: Golden amber (`oklch(0.70 0.15 70)`) - Warm, inviting highlight for calls-to-action and favorites, suggesting precious insights

**Foreground/Background Pairings**:
- Background (Cream #F8F7F4 / `oklch(0.97 0.01 80)`): Deep teal text (`oklch(0.35 0.12 200)`) - Ratio 7.2:1 ✓
- Primary (Deep Teal `oklch(0.55 0.12 200)`): Cream text (`oklch(0.97 0.01 80)`) - Ratio 5.8:1 ✓
- Accent (Golden Amber `oklch(0.70 0.15 70)`): Deep teal text (`oklch(0.35 0.12 200)`) - Ratio 4.9:1 ✓
- Card (Off-white `oklch(0.99 0.005 80)`): Primary text (`oklch(0.25 0.08 200)`) - Ratio 11.5:1 ✓

## Font Selection
Typography should feel literary yet accessible—like a personal journal meets a philosophy text.

**Primary Font**: Crimson Pro (serif) - Conveys wisdom, timelessness, and literary quality for body text and reflections
**Secondary Font**: Space Grotesk (sans-serif) - Modern, clear, and grounded for UI elements and navigation

**Typographic Hierarchy**:
- H1 (App Title/Logo): Space Grotesk Medium / 32px / -0.02em tracking / 1.2 line height
- H2 (Section Headers): Space Grotesk Medium / 24px / -0.01em tracking / 1.3 line height
- H3 (Card Titles): Space Grotesk Regular / 18px / normal tracking / 1.4 line height
- Body (Reflections/Quotes): Crimson Pro Regular / 17px / normal tracking / 1.7 line height
- UI Text (Buttons/Labels): Space Grotesk Regular / 15px / normal tracking / 1.5 line height
- Small (Dates/Meta): Space Grotesk Regular / 13px / normal tracking / 1.4 line height

## Animations
Animations should feel like gentle breaths or water ripples—organic, calming, and purposeful.

- **Page transitions**: Soft fade with subtle upward drift (300ms) to feel like turning pages
- **Card reveals**: Gentle scale-in (0.97→1.0) with fade, suggesting emergence of thought
- **Favorites**: Subtle pulse/glow on the heart icon, reinforcing emotional connection
- **Silent moment timer**: Slow, breathing animation (4s cycle) using scale and opacity
- **Ripple effect**: On logo and key interactions, circular waves emanating outward (Sada concept)
- **Journal entries**: Slide-up entrance (200ms) with slight blur-to-focus transition

## Component Selection

**Components**:
- **Card**: Primary container for reflections, journal entries, and library items with custom rounded corners and subtle shadows
- **Tabs**: Navigate between Reflection, Journal, Notes, and Library sections
- **Dialog**: For adding/editing library items and detailed note views
- **Button**: Multiple variants (primary for actions, ghost for subtle options, icon-only for favorites)
- **Textarea**: Multi-line input for journal entries and notes
- **Select**: Category filtering in library and preference selection
- **Badge**: Category tags on library items
- **ScrollArea**: For long lists of journal entries and library items
- **Separator**: Subtle dividers between sections

**Customizations**:
- **Logo Component**: Custom SVG with animated ripple effect (concentric circles emanating from center point)
- **Reflection Card**: Oversized card with centered text, subtle gradient background, and decorative quotation marks
- **Silent Moment Timer**: Custom circular progress indicator with breathing animation
- **Day Notes Split View**: Two-column layout with distinct but harmonious styling for "liked" vs "upset"

**States**:
- Buttons: Hover shows subtle lift (translateY -1px) and shadow increase, active shows slight depression
- Cards: Hover reveals action buttons with fade-in, maintains elevation hierarchy
- Inputs: Focus shows golden amber ring, filled state shows checkmark or count
- Empty states: Soft illustrations with encouraging copy, never harsh or demanding

**Icon Selection**:
- Heart (filled/outline) for favorites
- Plus/PlusCircle for adding new items
- BookOpen for library
- Notepad for journal
- SmileyXEyes/SmileyMeh for liked/upset notes
- Timer/Clock for silent moments
- Sparkle for daily reflection
- Tag for categories
- CaretRight for expanding items

**Spacing**:
- Container padding: `p-6` (24px) on mobile, `p-8` (32px) on desktop
- Card gaps: `gap-6` (24px) in main layout
- Section spacing: `space-y-4` (16px) for related items
- Tight spacing: `gap-2` (8px) for inline elements like badges
- Generous breathing room: `my-8` (32px) between major sections

**Mobile**:
- Single column layout throughout, prioritizing vertical scrolling
- Tabs become bottom navigation with icon-only labels
- Reflection card uses full width with adequate padding
- Day notes stack vertically (liked above upset)
- Library switches to list view from grid
- Bottom sheet for adding new items instead of dialog
- Touch targets minimum 44px for all interactive elements
