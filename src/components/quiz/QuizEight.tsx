import { useState } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DroppableProvided
} from '@hello-pangea/dnd'

interface Item {
  id: string
  content: string
}

const initialItems: Item[] = [
  { id: 'item-1', content: 'Float 🛟' },
  { id: 'item-2', content: 'Signal 🚨' },
  { id: 'item-3', content: 'Cherry' },
  { id: 'item-4', content: 'Date' }
]

const correctOrder: string[] = ['Apple', 'Banana', 'Cherry', 'Date'] // The correct order

function DragAndDropGame(): JSX.Element {
  const [items, setItems] = useState<Item[]>(shuffleArray([...initialItems]))

  // Function to shuffle the items
  function shuffleArray(array: Item[]): Item[] {
    return array.sort(() => Math.random() - 0.5)
  }

  function onDragEnd(result: DropResult): void {
    if (!result.destination) return

    const newItems = Array.from(items)
    const [movedItem] = newItems.splice(result.source.index, 1)
    newItems.splice(result.destination.index, 0, movedItem)

    setItems(newItems)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable'>
        {(provided: DroppableProvided) => (
          <div
            className='list'
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ padding: '10px', width: '200px', margin: '0 auto' }}
          >
            {items.map((item, index) => {
              const isCorrect = item.content === correctOrder[index]

              return (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided: DraggableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        userSelect: 'none',
                        backgroundColor: isCorrect ? '#40bf95' : '#b1b1b9',
                        border: '1px solid grey',
                        borderRadius: '4px',
                        padding: '8px',
                        marginBottom: '8px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <span>{item.content}</span>
                    </div>
                  )}
                </Draggable>
              )
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default DragAndDropGame
