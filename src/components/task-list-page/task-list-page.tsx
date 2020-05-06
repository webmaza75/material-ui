import * as React from 'react';

import AppPanel from '../app-panel/app-panel';
import AppTable from '../app-table/app-table';
import {
  getLeftTaskList,
  getSortedByIdTaskList
} from '../../utils';
import {ContextApp} from '../../reducer';
import ConfirmationDeleteDialog from '../confirmation-delete-dialog/confirmation-delete-dialog';
import SimpleSnackbar from '../simple-snackbar/simple-snackbar';
import {openModal} from '../modal-container/modal-container';

const classes = {
  tableWrapper: {
    marginTop: 150,
    marginRight: 'auto',
    marginBottom: 20,
    marginLeft: 'auto',
    width: '80%'
  },
  formWrapper: {
    width: '100%',
    maxWidth: '1280',
    margin: '150px auto 20px',
    padding: '90px 30px 30px',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    border: 'solid #C4C4C4 1px',
    boxShadow: '0 2px 4px rgba(0,0,0,.24)'
  },
  formWrapperTop: {
    backgroundColor: '#223C6E',
    width: '100%',
  },
  formWrapperStepper: {
    border: '1px solid #c4c4c4',
    borderBottom: '1px solid #e0e0e0',
    width: '80%',
    maxWidth: '1280',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#FFFFFF',
  }
};

interface IProps {

}

const TaskListPage = () => {
  const {taskList, actions} = React.useContext(ContextApp);
  const [selected, setSelected] = React.useState<number[]>([]);
  const [searchTitle, setSearchTitle] = React.useState('');
  const leftTaskList = getSortedByIdTaskList(getLeftTaskList(taskList, searchTitle));

  /**
   * Обработчик выделения строки.
   * @param {number} id Выделенная строка.
   */
  const handleItemSelect = (id: number): void => {
    const res = selected.includes(id);

    if (res === false) {
      setSelected((prevState) => [...prevState, id]);
    } else {
      setSelected((prevState) => prevState.filter((idx) => idx !== id));
    }
  };

  const handleSelectionReset = (): void => {
    setSelected([]);
  }

  const handleItemsDelete = async () => {
    const needShowSnackBar = await openModal(ConfirmationDeleteDialog);

    if (needShowSnackBar) {
      const undoList = taskList.filter(({id}) => selected.includes(id));

      setSelected([]);
      actions.deleteTasks(selected);

      const result = await openModal(SimpleSnackbar);

      if (!result) {
        actions.undoDeleteTasks(undoList);
      }

    } else {
      setSelected([]);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    handleSearchTitleSet(event.target.value);
  }

  const handleSearchTitleSet = (value: string): void => {
    setSearchTitle(value.trimLeft().replace(/\s{2,}/, ' '));
  }

  return <>
      <AppPanel
        selected={selected}
        onSelectionReset={handleSelectionReset}
        onItemsDelete={handleItemsDelete}
        onInputChange={handleInputChange}
        searchTitle={searchTitle}
      />

      <div style={classes.tableWrapper}>
        <AppTable
          taskList={leftTaskList}
          onItemSelect={handleItemSelect}
          selected={selected}
        />
      </div>
    </>;
  }

export default TaskListPage;
