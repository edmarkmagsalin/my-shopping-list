import { useState } from 'react';
import {
  DndContext, 
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Box, Button, Container, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import _ from 'lodash';
import { Quantity, ShoppingItem } from './types/commonTypes';
import SortableItem from './components/SortableItem';
import PopUpModal from './components/PopUpModal'
import AlertBanner from './components/AlertBanner'


const App = () => {
  // get data from local storage
  const [shoppingList, setShoppingList] = useState(
    JSON.parse(localStorage.getItem('shoppingList') as string) || []
  );

  // initialized the temporary shopping list
  const [temporaryShoppingList, setTemporaryShoppingList] = useState(shoppingList as ShoppingItem[]);

  // state for new item name
  const [newItemName, setNewItemName] = useState('' as any);
  // state for new item type
  const [newItemType, setNewItemType] = useState('' as any);

  // modal states
  const [modalMessage, setModalMessage] = useState('');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // alert banner states
  const [alertMessage, setAlertMessage] = useState('Info');
  const [alertSeverity, setAlertSeverity] = useState('info' as any);
  const [showAlert, setShowAlert] = useState(false);
  const handleShowAlert = () => setShowAlert(true);
  const handleHideAlert = () => setShowAlert(false);

  // clean up
  const cleanUp = () => {
    setNewItemName('');
    setNewItemType('');
    handleHideAlert();
  }

  // save new item to temporary shopping list
  const saveNewItem = () => {
    // identify if valid
    const isValid = newItemName !== '' && newItemType !== '';
    // identify what should be the next id
    const lastId = temporaryShoppingList.length ? Math.max(...temporaryShoppingList.map(o => o.id)) : 0;
    const newId = lastId + 1;
    if(isValid) {
      const newEntry: ShoppingItem = {
        id: newId,
        name: newItemName,
        type: newItemType,
        quantity: 1
      }
      setTemporaryShoppingList([
        ...temporaryShoppingList,
        newEntry
      ]);

      // clean up
      setNewItemName('');
      setNewItemType('');

      handleShowAlert();
      setAlertMessage('New item Saved!');
      setAlertSeverity('success');

      console.log('NEW item saved to temporary shopping list: ', newEntry);
    } else {
      handleShowAlert();
      setAlertMessage('Please complete the form.');
      setAlertSeverity('error');
    }
  }

  // update new item to temporary shopping list
  const updateItemName = (id: number, newName: string) => {
    const itemToUpdate = _.find(temporaryShoppingList, (item) => item.id===id);
    // identify if valid
    const isValid = !!itemToUpdate;
    // update
    if(isValid) {
      const newList = _.map(temporaryShoppingList, (datum) => {
        if(datum.id === id) {
          return {
            ...datum,
            name: newName
          }
        }
        return datum
      })
      setTemporaryShoppingList(newList);
    } else {
      setModalMessage('An error occured');
      handleOpen();
    }
  }

  const updateItemQuantity = (id: number, newQuantity: Quantity) => {
    const itemToUpdate = _.find(temporaryShoppingList, (item) => item.id===id);
    // identify if valid
    const isValid = newQuantity >= 1 && newQuantity <= 12 && !!itemToUpdate;
    // update
    if(isValid) {
      const newList = _.map(temporaryShoppingList, (datum) => {
        if(datum.id === id) {
          return {
            ...datum,
            quantity: newQuantity
          }
        }
        return datum
      })
      setTemporaryShoppingList(newList);
    } else {
      setModalMessage('An error occured');
      handleOpen();
    }
  }

  const deleteItem = (id: number) => {
    const newTemporaryShoppingList = temporaryShoppingList.filter(
      (datum: ShoppingItem) => datum.id !== id
    );
    setTemporaryShoppingList(newTemporaryShoppingList);
    setAlertMessage('Item deleted');
    setAlertSeverity('info');
    handleShowAlert();
  };

  // save temporary shopping list to localstorage/server
  const saveMyShoppingList = () => {
    let isValid = true;

    temporaryShoppingList.forEach((datum: ShoppingItem) => {
      const hasId = !!datum.id;
      const hasName = datum.name !== '';
      const hasType = datum.type === 'Grocery' || datum.type === 'Home Goods' || datum.type === 'Hardware';
      const hasQuantity = datum.quantity >= 1 && datum.quantity <= 12;
      if(!hasId || !hasName || !hasType || !hasQuantity) {
        isValid = false;
      }
    })

    if(isValid) {
      localStorage.setItem(
        'shoppingList',
        JSON.stringify(temporaryShoppingList)
      );
      // update shopping list as well using the temporary shopping list
      setShoppingList(temporaryShoppingList);

      setModalMessage('Shopping List Saved!');
      handleOpen();
      cleanUp();
    } else {
      setModalMessage('Error while saving Shopping List.');
      handleOpen();
      cleanUp();
    }
  };

  // cancel changes and refresh temporary shopping list data from localstorage/server
  const cancelChangesInTemporaryShoppingList = () => {
    setTemporaryShoppingList(shoppingList as ShoppingItem[]);
    setModalMessage('Changes was cleared.');
    handleOpen();
    cleanUp();
  };

  const handleItemTypeChange = (event: SelectChangeEvent) => {
    setNewItemType(event.target.value as string);
  };

  // handle sorting
  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleDragEnd = (event: any) => {
    const {active, over} = event;
    if (active.id !== over.id) {
      setTemporaryShoppingList((temporaryShoppingList) => {
        const oldIndex = _.indexOf(temporaryShoppingList, _.find(temporaryShoppingList, (item) => item.id===active.id));
        const newIndex = _.indexOf(temporaryShoppingList, _.find(temporaryShoppingList, (item) => item.id===over.id));
        return arrayMove(temporaryShoppingList, oldIndex, newIndex);
      })
    }
  }

  return (
    <Container maxWidth='md'>
      <Card  style={{ borderRadius: '1.5em', marginBottom: '2em' }} raised>
        <CardContent style={{ padding: '2em' }}>
          <AlertBanner
            showAlert={showAlert}
            alertSeverity={alertSeverity}
            handleHideAlert={handleHideAlert}
            alertMessage={alertMessage}
          />
          <h2>MY SHOPPING LIST</h2>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <FormControl fullWidth>
                <TextField value={newItemName} id="item-name" label="List Name" variant="outlined" required
                  onChange={(e) => setNewItemName(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid xs={6}>
              <FormControl required fullWidth>
                <InputLabel id="item-type-label">Type</InputLabel>
                <Select
                  labelId="item-type-label"
                  id="item-type"
                  value={newItemType}
                  label="Type"
                  onChange={handleItemTypeChange}
                  required
                >
                  <MenuItem value='Grocery'>Grocery</MenuItem>
                  <MenuItem value='Home Goods'>Home Goods</MenuItem>
                  <MenuItem value='Hardware'>Hardware</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Button onClick={saveNewItem} variant="contained" startIcon={<AddIcon />} fullWidth>
                Add an item
              </Button>
            </Grid>
            <Grid xs={1} />
            <Grid xs={7}>
              <h3>Item Name</h3>
            </Grid>
            <Grid xs={3}>
              <h3>Quantity</h3>
            </Grid>
            <Grid xs={1} />
          </Grid>
          <Box sx={{ width: '100%' }}>
            <Stack spacing={2}>
              {
                temporaryShoppingList.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={temporaryShoppingList}
                      strategy={verticalListSortingStrategy}
                    >
                      {
                        temporaryShoppingList.map((datum) => (
                          <SortableItem
                            key={datum.id}
                            id={datum.id}
                            datum={datum}
                            updateItemName={updateItemName}
                            updateItemQuantity={updateItemQuantity}
                            deleteItem={deleteItem}
                          />
                        ))
                      }
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div style={{textAlign: 'center'}}>
                    No Data
                  </div>
                )
              }
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <Grid container spacing={2} textAlign='right'>
        <Grid xs={12}>
          <Button style={{margin: '0.5em'}} variant="contained" onClick={saveMyShoppingList}>
            Save
          </Button>
          <Button style={{margin: '0.5em'}} variant="contained" color='warning' onClick={cancelChangesInTemporaryShoppingList}>
            Cancel
          </Button>
        </Grid>
      </Grid>
      <PopUpModal
        open={open}
        modalMessage={modalMessage}
        handleClose={handleClose}
      ></PopUpModal>
    </Container>
  );
}

export default App;