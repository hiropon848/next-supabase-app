# Glass Liquid UI 実装ウォークスルー

このドキュメントは、ログインカード向けの「Glass Liquid UI（液体のようなガラスエフェクト）」実装の概要です。目的は、カードの端に静的かつ有機的なレンズのような歪みを加えつつ、中央部分はクリアで読みやすい状態を保ち、高品質なリファレンスデザインを再現することでした。

## 目次

1. [コア技術: SVG 屈折フィルター](#1-コア技術-svg-屈折フィルター)
2. [適用範囲の制御: CSS マスキング](#2-適用範囲の制御-css-マスキング)
3. [視覚的な調整](#3-視覚的な調整)
4. [レイヤー構造](#4-レイヤー構造)
5. [検証](#検証)
6. [機能: パスワード表示切り替え](#5-機能-パスワード表示切り替え)

## 1. コア技術: SVG 屈折フィルター

低周波の乱流（turbulence）を利用したSVGフィルターアプローチを採用し、液体の光学的歪みをシミュレートしました。

### フィルター構造 (`src/app/login/page.tsx`)

```xml
<filter id="liquid-distortion" ...>
    <!-- 1. 低周波の有機的なノイズを生成 -->
    <feTurbulence type="fractalNoise" baseFrequency="0.004 0.004" numOctaves="1" seed="0" result="noise" />

    <!-- 2. ノイズをぼかして滑らかな波にする -->
    <feGaussianBlur in="noise" stdDeviation="8" result="blurred" />

    <!-- 3. 強度を調整（Arithmetic Composite） -->
    <feComposite operator="arithmetic" k1="0" k2="1" k3="2" k4="0" in="blurred" in2="blurred" result="litImage" />

    <!-- 4. 変位マップの適用（重要プロパティ） -->
    <!-- scale="-70" で背景を凸レンズのように内側に引き込む -->
    <feDisplacementMap in="SourceGraphic" in2="litImage" scale="-70" xChannelSelector="G" yChannelSelector="G" />
</filter>
```

## 2. 適用範囲の制御: CSS マスキング

テキストの可読性を確保するため、円形グラデーションマスクを使用して歪みをカードの端に厳密に制限しました。

```css
maskimage: 'radial-gradient(circle at center, transparent 50%, black 85%)';
```

- **0% - 50%**: 透明（中央部分には歪みを適用しない）。
- **85% - 100%**: 黒（端部分に完全に歪みを適用）。
  この急激な変化により、独特の「ガラスの境界線」の見た目が生まれます。

## 3. 視覚的な調整

理想的な美観に合わせて、いくつかの調整を行いました：

- **歪みのスケール**: **`-70`** に調整（ユーザー設定）し、強力ですが制御された液体の歪みを実現。
- **ベースのぼかし**: `backdrop-blur-[2px]` に抑え、「すりガラス」のような曇りを避け、非常に繊細で透明度の高いガラスの質感を表現。
- **コーナーのハイライト**: 左上と右下の境界線を明るくし（`opacity: 1.0`, `stroke-opacity: 0.7`）、3D形状を強調。
- **タイポグラフィと入力欄**:
  - レイアウトのバランスをとるため、`font-medium` と `text-center` を採用。
  - ラベルを `text-xs` (12px) に更新。
  - 入力欄の視認性を向上: `bg-white/[0.15]` (フォーカス時: `0.25`)、`border-white/30` (フォーカス時: `60`)。
  - 二重境界線効果を防ぐため、デフォルトのフォーカスリングを削除。
  - 歪んだ背景に対する可読性を高めるため、入力欄の背後に `backdrop-blur-[4px]` を追加。
  - プレースホルダーの不透明度を **60%** に設定し、視認性を向上。

## 4. レイヤー構造

エフェクトは、絶対配置された多層スタックによって機能しています：

- **Layer 0 (Border)**: グラデーション付きのSVGストローク。
- **Layer 1 (Refraction)**: メインエフェクト。`backdrop-filter: url(#liquid-distortion)`。
- **Layer 2 (Tint/Blur)**: ベースの素材感のための `bg-white/[0.01]` + `backdrop-blur-[2px]`。
- **Layer 3 (Content)**: `z-30` を設定し、入力欄やボタンが歪みの影響を受けず、クリック可能であることを保証。

## 検証

- **視覚確認**: 液体の端の歪みが「Zenn」記事のリファレンススタイルと一致することを確認。
- **機能確認**: 入力フィールドが完全にインタラクティブで、フォーカス可能であることを確認。

![最終結果](/Users/hiroakihashiba/.gemini/antigravity/brain/c73b7075-2871-4109-b656-64144aeffc50/login_page_effect_check_1766775670454.png)

## 5. 機能: パスワード表示切り替え

パスワード入力フィールドに、実用的な表示切り替えトグルを追加しました：

- **状態管理**: `useState` を使用して、入力タイプを `password` と `text` の間で切り替えます。
- **アイコン**: 明確な視覚的フィードバックのために、`react-icons/md` から `MdVisibility` と `MdVisibilityOff` アイコンを統合しました。
- **インタラクション**: トグルボタンは入力ラッパー内に絶対配置され、アクセスしやすいように常に表示されます（入力が空の場合でも）。
- **スタイリング**: ホバー効果 (`text-white/70` -> `text-white`) により、インタラクティブであることを示唆します。
