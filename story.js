export default `

title: level_1
---
Your first level
You take a deep breath
And guess
<<play>>
<<if $wonLastLevel>>
  You beat level 1!
  <<jump level_1>>
<<else>>
  You lost on level 1.
  <<jump level_2>>
<<endif>>
===

title: level_2
---
Your second level
You take a deep breath
And guess
<<play>>
<<if $wonLastLevel>>
  You beat level 2!
  <<jump level_2>>
<<else>>
  You lost on level 2.
  <<jump level_x>>
<<endif>>
===

title: level_x
---
Another level.
You take a deep breath
And guess
<<play>>
<<if $wonLastLevel>>
  You beat another level. Goodie.
  <<jump level_x>>
<<else>>
  You lost another level.
  <<jump level_x>>
<<endif>>
===

`
