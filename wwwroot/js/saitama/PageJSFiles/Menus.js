let dt = new DateHandler();
let saveLoadMenusData = [];

let select_id_menu_name = { id: '', name: '' };

let sub = {
    1: { color: 'success', state: 'Active' },
    0: { color: 'danger', state: 'Inactive' }
}

makeAPIRequest('/api/project/getprojects/*', 'GET', '', loadForProjectsSelectBox);

// Select for projects
function loadForProjectsSelectBox(data) {

    let options = '<option value="-1" disabled selected >Select Project</option>';

    try {
        data = JSON.parse(data);

        data.forEach((element) => {
            options += '<option value="' + element.id + '">' + element.projectName + '</option>';
        });

        document.querySelector('#slctProject').innerHTML = options;
    } catch (ex) {
        console.log('An error occurred : ' + ex);
        document.querySelector('#slctProject').innerHTML = options;
    }

}

// Select Event on Project
document.querySelector('#slctProject').addEventListener('change', function() {
    document.querySelector('#srchTerm').disabled = true;
    document.querySelector('#btnAddMenu').disabled = true;

    document.querySelector('#menus-tbody').innerHTML = ``;
    makeAPIRequest('/api/application/getapplicationbyprojectid/' + this.value, 'GET', '', loadForAppsSelectBox);
});

// Select for apps
function loadForAppsSelectBox(data) {
    let options = '<option value="-1" disabled selected >Select Application</option>';
    try {
        data = JSON.parse(data);

        data.forEach((element) => {
            options += '<option value="' + element.id + '">' + element.name + '</option>';
        });

        document.querySelector('#slctApplication').innerHTML = options;
    } catch (ex) {
        console.log('An error occurred : ' + ex);
        document.querySelector('#slctApplication').innerHTML = options;
    }

}

// Select Event on Application
document.querySelector('#slctApplication').addEventListener('change', function() {
    createMenuTree(this.value);
    document.querySelector('#btnAddMenu').disabled = false;
    document.querySelector('#srchTerm').value = '';
});


function createMenuTree(applicationId) {

    makeAPIRequest('/api/menus/getmenusandsubbyapplicationId/' + applicationId, 'GET', '', function(data) {
        try {
            data = LoopThroughAndGetMenuName(JSON.parse(data));
            data = removeDuplicates(data, 'id');
            createMenuTable(data);
        } catch (ex) {
            console.log('Error here boi: ' + ex);
            createMenuTable([]);
        }

    });
}

function LoopThroughAndGetMenuName(data) {
    let f = [],
        t = [];
    data.forEach((element, index) => {
        let n = element;
        element.child ? t = LoopThroughAndGetMenuName(element.child) : '';
        delete n.child
        f.push(n, ...t);
    });

    return f;
}


function createMenuTable(data) {

    try {

        saveLoadMenusData = [];

        if (data.length > 0) {
            document.querySelector('#srchTerm').disabled = false;
            document.querySelector('#menus-tbody').innerHTML = ``;
            $('#tree').treetable('destroy');

            let view = ''
            let empty = 'Not provided';

            const render = (id) => `data-tt-parent-id="${id}"`;

            const mainParentId = '00000000-0000-0000-0000-000000000000';

            data.forEach(ele => {
                if (ele.id !== mainParentId) {

                    saveLoadMenusData.push(ele);

                    view += `
                        <tr data-tt-id="${ele.id}" ${ele.parent !== mainParentId ? render(ele.parent) : ``}>
                            <td>
                                <i class=""></i>${ele.name}
                            </td>
        
                            <td>
                                <span class="badge badge-dot mr-4">
                                    <i class="bg-${ele.status == 1 ? `success` : `warning`}"></i> <span class="btn btn-${sub[ele.status].color} btn-sm" disabled> ${sub[ele.status].state}</span>
                                </span>
                            </td>
        
                            <td>
                                <i class=""></i>${ele.controller ? ele.controller : empty}
                            </td>
        
                            <td>
                                <i class=""></i>${ele.method ? ele.method : empty}
                            </td>
        
                            <td class="text-center">
                                <a href="#" class="text-inverse editButton" id="${ele.id}" title="Edit"><i class="fas fa-edit"></i></a>
                            </td>
                        </tr >
                        `;
                }
    
            });
    
            document.querySelector('#menus-tbody').innerHTML = `${view}`;
    
            $("#tree").treetable({ expandable: true });
            $('span.indenter > a[title="Expand"]').html(`<i class='fa fa-caret-right'></i>`);
            bindButtonsToDom();
        }
        else{
            document.querySelector('#menus-tbody').innerHTML = ``
        }

        
    } catch (ex) {
        console.log('An error occurred : ' + ex);
        document.querySelector('#srchTerm').disabled = true;
        document.querySelector('#menus-tbody').innerHTML = ``
    }
}


document.querySelector('#btnAddMenu').addEventListener('click', function () {
    $('#menusModal').modal('toggle');

    saveOrUpdate = 0;
    clearInputFieldsAndCheckbox();
    select_id_menu_name['id'] = '';
    
    document.querySelector('#btnSaveMenu').innerText = 'Create';

    if ($('#myUL')) {
        listTreeView(saveLoadMenusData);
    }

});

// make HTML UL
function makeUL(list, result) {

    for (let i = 0; i < list.length; i++) {
        let node = list[i];
        let li = result.appendChild(document.createElement("li"));
        li.classList.add("list-group-item");
        let span = li.appendChild(document.createElement("span"));
        span.innerHTML = node.name;
        span.setAttribute("id", node.id)
        span.classList.add("all-span");

        if (node.child.length > 0) {
            span.classList.add("caret");
            let new_ul = document.createElement("ul")
            new_ul.classList.add("nested");
            makeUL(node.child, li.appendChild(new_ul));
        }
    }
    return result;
}

function bindButtonsToDom() {
    let elements = document.getElementsByClassName('editButton');
    for (let x = 0; x < elements.length; x++) {
        elements[x].addEventListener('click', function (e) { 
            getDataByID(this.id);
            select_id_menu_name['id'] = '';
        });
    }
}

function getDataByID(rowId) {
    menuId = rowId;
    let data = saveLoadMenusData.filter((ele) => ele.id === rowId);
    populateInputFields(data[0]);
    saveOrUpdate = 1;
}

function clearInputFieldsAndCheckbox(){
    document.querySelector('#txtName').value = '';
    document.querySelector('#txtController').value = '';
    document.querySelector('#txtMethod').value = '';
    document.querySelector('#txtParent').value = '';
    document.querySelector('#notes').value = '';
    
    displayStatus(1, '#switch');
}


let selectedMenuData = null;
function populateInputFields(data) {
    selectedMenuData = data;
    document.querySelector('#txtName').value = data.name;
    document.querySelector('#txtController').value = data.controller;
    document.querySelector('#txtMethod').value = data.method;
    document.querySelector('#txtParent').value = data.parent === '00000000-0000-0000-0000-000000000000' ? 'Main Menu' : saveLoadMenusData.filter((ele) => ele.id === data.parent)[0].name;
    document.querySelector('#notes').value = data.description;
    displayStatus(data.status, '#switch');
    document.querySelector('#btnSaveMenu').innerText = 'Update';

    $('#menusModal').modal('toggle');
}

document.querySelector('#btnSaveMenu').addEventListener('click', function () {

    let postData = {
        applicationId: document.querySelector('#slctApplication').value,
        parent: document.querySelector('#txtParent').value ? select_id_menu_name['id'] : '00000000-0000-0000-0000-000000000000',
        projectId: document.querySelector('#slctProject').value,
        status: document.querySelector('#switch').checked ? 1 : 0,
        uniqueId: generateGUID(),
        controller: document.querySelector('#txtController').value,
        description: document.querySelector('#notes').value,
        method: document.querySelector('#txtMethod').value,
        name: document.querySelector('#txtName').value
      };

      if(postData.name !== '' && postData.method !== ''){
        saveOrUpdate != 1 ? createMenu(postData) : updateMenu(postData);
      }
      else{
          messenger('validate');
      }

});

function createMenu(data) {

    selectedMenuData = null;
    select_id_menu_name['id'] = '';

    makeAPIRequest('/api/menu/postmenu', 'POST', data, function (response) {
        try{

            response = JSON.parse(response);

            if(response.length > 0){
                createMenuTree(data.applicationId);
                $('#menusModal').modal('hide');
                messenger('custom_success', 'Menu Created Successfully');
            }
            else{
                messenger('warning'); 
            }
            
        }catch(ex){
            messenger('error');
        }
        
    });
}

function updateMenu(data) {
    let menuId = selectedMenuData.id
    data.uniqueId = selectedMenuData.uniqueId;
    data.parent = data.parent ? data.parent : selectedMenuData.parent

    selectedMenuData = null;
    select_id_menu_name['id'] = '';

    makeAPIRequest(`/api/menu/putmenu/${menuId}`, 'PUT', data, function (response) {
        
        if(response === 'Successfully Updated'){
            createMenuTree(data.applicationId);

            $('#menusModal').modal('hide');
            messenger('custom_success', 'Menu Updated Successfully');
        }else{
            messenger('warning'); 
        }
        
    });
}

document.querySelector('#srchTerm').addEventListener('keyup', function (e) {

    let value = this.value.toLowerCase();

    value != '' ? document.querySelector('#btnSearch').disabled = false : document.querySelector('#btnSearch').disabled = true;

    if (value === '') createMenuTable(saveLoadMenusData);

    if (e.which === 13 && this.value !== '') {
        $('#btnSearch').click();
        return false;
    }

});

document.querySelector('#btnSearch').addEventListener('click', function (e) {
    let value = document.querySelector('#srchTerm').value.toLowerCase();
    if (value !== '*') {
        $("#menus-tbody > tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    }
});

// Highlight selected row
$("#tree tbody").on("click", "tr", function () {

    let currentPlace = $(this).find('td:first-child').find('span').find('a').find('i')
    if (currentPlace.hasClass("fa-caret-right")) {
        $('span.indenter > a[title="Expand"]').html(`<i class='fa fa-caret-right'></i>`);
        $('span.indenter > a[title="Collapse"]').html(`<i class='fa fa-caret-down'></i>`);
        currentPlace.removeClass("fa-caret-right").addClass('fa-caret-down');
    }
    else {
        $('span.indenter > a[title="Expand"]').html(`<i class='fa fa-caret-right'></i>`);
        $('span.indenter > a[title="Collapse"]').html(`<i class='fa fa-caret-down'></i>`);
        currentPlace.removeClass("fa-caret-down").addClass('fa-caret-right')
    }
});

// Get Parent
document.querySelector('#txtParent').addEventListener('click', function (evnt) {
    $('#parentMenuModal').modal('show');
});

function SortMenusLoaded(menus, parent) {
    let nodes = [];

    menus = menus.filter(x => x.id !== '00000000-0000-0000-0000-000000000000');

    menus.filter(function (d) { return d.parent === parent }).forEach(function (d) {
        let cd = d;
        cd.child = SortMenusLoaded(menus, d.id);
        return nodes.push(cd);
    });
    return nodes;
}

function bindEvntForListTreee() {
    let toggler = document.getElementsByClassName("caret");

    for (let i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }

    let allList = document.getElementsByClassName('all-span');
    for (let i = 0; i < allList.length; i++) {
        
        allList[i].addEventListener("click", function () {

            resetDocument(allList);

            this.style.color = '#5e72e4';
            this.style.fontSize = '13px';

            select_id_menu_name['id'] = this.id;
            select_id_menu_name['name'] = this.innerText;
        });
    }
}

function resetDocument(element){
    for (let i = 0; i < element.length; i++) {
        element[i].style.color = '#525f7f';
        element[i].style.fontSize = '12px';
    }
}

function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

// Render List to select parent menu.
function listTreeView(data) {

    // Destroy existing elements and re-append.
    if(document.getElementById("myUL")){
        removeElement('myUL');
    }

    data = SortMenusLoaded(data, '00000000-0000-0000-0000-000000000000');

    let new_ul = document.createElement("ul");
    new_ul.setAttribute("id", "myUL");
    new_ul.classList.add("list-group");

    let result = makeUL(data, new_ul);
    let elementAppend = document.querySelector('#menu-tree-list');

    elementAppend.append(result);

    bindEvntForListTreee();
}; 

document.querySelector('#btnOkay').addEventListener('click', function (evnt) {
    $('#parentMenuModal').modal('hide');
    document.querySelector('#txtParent').value = select_id_menu_name['name'];
});

document.querySelector('#btnStop').addEventListener('click', function (evnt) {
    $('#parentMenuModal').modal('hide');
});