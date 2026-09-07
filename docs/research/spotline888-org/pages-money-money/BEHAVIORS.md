# Interaction & Animation Behaviors: /pages/money/money

## 1. Liquid Wave Simulation Animation
- **Trigger**: Continuous idle state on page load.
- **Layers**:
  - `animate-wave1`: Foreground SVG wave drifting at 10s linear loop with subtle vertical scaling (`scaleY(1)` to `scaleY(1.1)`).
  - `animate-wave2`: Background SVG wave drifting in reverse at 14s loop with counter-phase vertical expansion.
  - `animate-pulse-glow`: Ambient gold-blue radial light orb pulsing smoothly between 35% and 65% opacity.
- **Purpose**: Mimics water-filling dynamic vault mechanism commonly found in high-yield finance applications (Yu'ebao).

## 2. Balance Visibility Toggle
- **Trigger**: Click on eye icon.
- **States**:
  - Visible: Exact numeric balance (`2450.00 USDT`), confirmed shares, and pending shares.
  - Hidden: Masked asterisks (`••••••`).

## 3. Transfer Direction Swap
- **Trigger**: Click on swap icon button (`ArrowLeftRight`).
- **Animation**: Smooth 180° rotation (`duration-300 transform rotate-180`).
- **State Changes**:
  - Mode switches between `deposit` (Balance -> Yu'ebao) and `withdraw` (Yu'ebao -> Balance).
  - Source balance and target destination labels flip smoothly.
  - Input amount resets and error messages clear.

## 4. Quick Percentage Allocation
- **Trigger**: Tap `25%`, `50%`, `75%`, `100%`.
- **Computation**: Calculates fraction of source balance to 2 decimal places and populates the amount input instantly.

## 5. Submission Feedback
- **States**:
  - Validation: Displays inline warning if amount is <= 0 or exceeds available balance.
  - Submitting: Button disables with spinning loader.
  - Success: Emits top-center toast notification (`Chuyển khoản thành công` / `Transfer successful`) with checkmark icon and updates local balances dynamically.

## 6. Slide-up Details History Drawer
- **Trigger**: Click "Chi tiết" / "Details" in top navigation bar.
- **Animation**: Backdrop fades in (`fade-in`), bottom sheet slides up (`slide-in-from-bottom duration-300`).
- **Filter Tabs**: Tabs switch between All, Deposit, Withdraw, and Earnings with animated blue indicator bar.
