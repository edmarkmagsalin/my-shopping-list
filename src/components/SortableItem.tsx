import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, FormControl, MenuItem, Select, TextField } from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Quantity } from '../types/commonTypes';

const SortableItem = (props: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const grabIconStyle = {
    cursor: 'grab'
  };
  
  const actionIconStyle = {
    cursor: 'pointer'
  };

  const { updateItemName, updateItemQuantity, deleteItem } = props;
  const { id, name, quantity } = props.datum;
  
  return (
    <Card ref={setNodeRef} {...attributes} style={{ ...style, padding: '1em', backgroundColor: '#f5f6f8' }} key={id} variant="outlined">
      <Grid container spacing={2}>
        <Grid xs={1}>
          <DragHandleIcon style={grabIconStyle} {...listeners} color='action' fontSize='large' />
        </Grid>
        <Grid xs={7}>
          <FormControl fullWidth>
            <TextField onChange={(e) => updateItemName(id, e.target.value)} size='small' value={name} variant="outlined" title={'ID: #'+id.toString()} required />
          </FormControl>
        </Grid>
        <Grid xs={3}>
          <FormControl fullWidth>
            <Select
              size='small'
              id="item-type"
              value={quantity.toString()}
              onChange={(e) => updateItemQuantity(id, parseInt(e.target.value) as Quantity)}
              required
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={11}>11</MenuItem>
              <MenuItem value={12}>12</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={1}>
          <RemoveCircleIcon style={actionIconStyle} onClick={() => deleteItem(id)} color='error' fontSize='large' />
        </Grid>
      </Grid>
    </Card>
  );
}

export default SortableItem;