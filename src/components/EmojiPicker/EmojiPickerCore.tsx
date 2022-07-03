import { Picker, PickerProps } from "emoji-mart"
import React, { useEffect, useRef } from "react"

export type EmojiPickerCoreProps = Omit<PickerProps, "onSelect"> & {
  onEmojiSelect: PickerProps["onSelect"]
}

const EmojiPickerCore: React.FC<EmojiPickerCoreProps> = React.memo((props) => {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    new Picker({
      ...props,
      set: "twitter",
      i18n: {
        search: "検索",
        search_no_results_1: "申し訳ありません",
        search_no_results_2: "その絵文字は見つかりませんでした",
        pick: "絵文字を選択...",
        add_custom: "絵文字を追加する",
        categories: {
          activity: "アクティビティ",
          custom: "カスタム",
          flags: "旗",
          foods: "フード ＆ ドリンク",
          // @ts-ignore
          frequent: "よく使う絵文字",
          nature: "動物 ＆ 自然",
          objects: "オブジェクト",
          people: "スマイリー ＆ 人",
          places: "トラベル ＆ 場所",
          search: "検索結果",
          symbols: "記号",
        },
        skins: {
          choose: "デフォルトの肌の色を選択する",
          "1": "標準",
          "2": "明るい肌色",
          "3": "やや明るい肌色",
          "4": "肌色",
          "5": "やや濃い肌色",
          "6": "濃い肌色",
        },
      },
      previewPosition: "none",
      // @ts-ignore
      data: async () => {
        const response = await fetch(
          "https://cdn.jsdelivr.net/npm/@emoji-mart/data@latest/sets/14/twitter.json",
        )
        return response.json()
      },
      ref,
    })
  }, [])

  // NOTE: To prevent emoji mart rendered twice. This is because useEffect is called twice in React18.
  return <div ref={ref} className="emoji-picker-wrapper z-[999]" />
})

export default EmojiPickerCore
