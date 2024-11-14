# Markdown to TC-scrolly

Use a markdown file to generate a scrollytelling story in React

## Insert an image

Use the below pattern to insert a figure.

| Property   | Type    | Options               |
| ---------- | ------- | --------------------- |
| src        | string  | image link            |
| className  | string  | classname for figure  |
| lazyLoad   | string? | 'lazy', none          |
| align      | string? | 'left', 'right', none |
| caption    | string  | caption for image     |
| source     | string  | source name for image |
| sourceLink | string  | source link for image |

```js
<Figure
  src='https://images.theconversation.com/files/626809/original/file-20241021-17-jdccb2.jpg'
  lazyLoad='lazy'
  className=''
  align=''
  caption=''
  source=''
  sourceLink=''
/>
```

## Insert scrolly section

Use the below pattern to insert a scrolly section.

### ScrollSection

| Property  | Type   | Options                    |
| --------- | ------ | -------------------------- |
| pinType   | string | 'pin_block', 'pin_clipped' |
| className | string | classname for figure       |

### ScrollFigure

| Property     | Type    | Options               |
| ------------ | ------- | --------------------- |
| src          | string  | image link            |
| className    | string  | classname for figure  |
| imgClassName | string  | classname for image   |
| lazyLoad     | string? | 'lazy', none          |
| float        | string? | 'left', 'right', none |
| figcaption   | string  | caption for image     |
| source       | string  | source name for image |
| sourceLink   | string  | source link for image |

### ScrollTextChapter

| Property  | Type    | Options                                            |
| --------- | ------- | -------------------------------------------------- |
| className | string  | classname for text                                 |
| position  | string? | 'middle','right','left (none defaults to 'middle') |
| step      | string? | 'step', none                                       |

```js
<ScrollSection pinType='pin_block' className='my-12'>
  <ScrollBackground>
    <ScrollFigure
      src='https://images.theconversation.com/files/627226/original/file-20241022-16-jazot7.jpg'
      className='make_visible'
      imgClassName=''
      figcaption=''
      source=''
      sourceLink=''
      lazyLoad=''
    />
    <ScrollFigure
      src='https://images.theconversation.com/files/627222/original/file-20241022-20-4x1vlk.jpg'
      className=''
      imgClassName=''
      figcaption=''
      source=''
      sourceLink=''
      lazyLoad='lazy'
    />
  </ScrollBackground>
  <ScrollForeground>
    <ScrollTextChapter className='mt-[20vh]' position='right'>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia cum nulla esse accusantium maiores laborum
      similique rerum quam ad qui.
    </ScrollTextChapter>
    <ScrollTextChapter step='step'>
      Perferendis porro eveniet placeat, rerum soluta blanditiis natus. Iure itaque odit a quibusdam quidem rerum
      expedita ratione nesciunt dolorum omnis.
    </ScrollTextChapter>
    <ScrollTextChapter step='step'>
      Dolorum praesentium tempore quod eius alias, harum officiis provident at quia porro sequi? Quo quidem ipsam
      corrupti numquam tempora laudantium!
    </ScrollTextChapter>
  </ScrollForeground>
</ScrollSection>
```
