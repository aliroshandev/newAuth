import React, { useEffect, useRef, useState } from "react";
import { Col, notification, Row, AutoComplete, Button, Skeleton } from "antd";
import "./ResourcePermissions.scss";
import { useGetApiCall } from "base/hooks/useGetApiCall";
import { asyncHttpRequest } from "base/services/asyncHttpRequest";
import ErrorSection from "base/components/ErrorSection/ErrorSection";
import { SubmitBtn } from "../Buttons/Buttons";
import { AiOutlineTable } from "react-icons/ai";
import { HiOutlineRefresh } from "react-icons/hi";

const ResourcePermissions = () => {
  const [selectedClientId, setSelectedClientId] = useState();
  const [selectedMenuId, setSelectedMenuId] = useState();
  // const [selectedRoleId, setSelectedRoleId] = useState();
  const [showAccessTable, setShowAccessTable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [allValues, setAllValues] = useState({});

  const tableHeader = useRef();

  const {
    response: clients,
    status: clientsStatus,
    refetchApi: clientsRefetch,
  } = useGetApiCall({
    endpoint: "/api/clients",
  });

  const {
    response: menus,
    status: menusStatus,
    refetchApi: menusRefetch,
  } = useGetApiCall({
    endpoint: `/api/menus/client-id/${selectedClientId}`,
    enabled: !!selectedClientId,
  });

  const {
    response: resources,
    status: resourcesStatus,
    refetchApi: resourcesRefetch,
  } = useGetApiCall({
    endpoint: `/api/resources/menu-id/${selectedMenuId}`,
    enabled: !!selectedMenuId,
  });

  const {
    response: accessRole,
    status: accessRolesStatus,
    refetchApi: accessRolesRefetch,
  } = useGetApiCall({
    endpoint: `/api/resource-permission/find-by-menu-id/${selectedMenuId}`,
    enabled: !!selectedMenuId,
  });

  const {
    response: permissions,
    status: permissionsStatus,
    refetchApi: permissionsRefetch,
  } = useGetApiCall({
    endpoint: "/api/permissions?pageSize=100&currentPage=1",
  });

  useEffect(() => {
    if (accessRole?.data && resources?.data && permissions?.data) {
      debugger;
      accessRole?.data?.map((resource) => {
        const currentPermissions = [];

        resource.permissionDtoList.map((dtoItem) => {
          currentPermissions.push(dtoItem.id);
        });

        permissions?.data?.rows?.map((permission) => {
          const resourceTypePermission = resource.permissionDtoList;
          let selectedPermission = resourceTypePermission?.find(
            (rtp) => rtp.title === permission.title
          );

          accessRole.data.find((accessRoleItem) => {
            if (selectedPermission?.resourcePermissionId)
              accessRoleItem.permissionDtoList.map((item) => {
                if (selectedPermission.id === item?.id) {
                  let temp = { ...allValues };
                  temp[resource.resourceId] = {
                    resourceTypePermissionUuidList: [...currentPermissions],
                  };
                  setAllValues((p) => {
                    return { ...p, ...temp };
                  });
                }
              });
          });
        });
      });

      // setCurrentAccess(accessRole?.data);
    }
  }, [accessRole, resources, permissions]);

  function togglePermission(id, objectData) {
    if (
      !objectData ||
      Object.keys(objectData).length === 0 ||
      !objectData.resourceTypePermissionUuidList ||
      objectData.resourceTypePermissionUuidList.length === 0
    ) {
      return {
        resourceTypePermissionUuidList: [id],
      };
    }
    if (objectData.resourceTypePermissionUuidList.includes(id)) {
      return {
        resourceTypePermissionUuidList:
          objectData.resourceTypePermissionUuidList.filter(
            (item) => item !== id
          ),
      };
    }
    return {
      resourceTypePermissionUuidList: [
        ...objectData.resourceTypePermissionUuidList,
        id,
      ],
    };
  }

  async function handleSave() {
    let data = [];
    for (let [key, values] of Object.entries(allValues)) {
      let temp = {
        resourceId: key,
        permissions: values.resourceTypePermissionUuidList,
      };
      data.push(temp);
    }
    setIsUpdating(true);
    asyncHttpRequest({
      method: "POST",
      endpoint: `api/resource-permission/save-all?menuId=${selectedMenuId}`,
      data,
    })
      .then((res) => {
        setIsUpdating(false);
        notification.success({
          message: "عملیات با موفقیت انجام شد",
          placement: "bottomLeft",
        });
      })
      .catch((e) => {
        setIsUpdating(false);
        notification.error({
          message: "خطا در انجام عملیات",
          placement: "bottomLeft",
        });
      });
  }

  const isChecked = ({ allValues, resourceId, permissionId }) => {
    console.log(resourceId, permissionId);
    debugger;
    let result = false;
    [allValues]?.map((item) => {
      debugger;
      if (!item[resourceId]) result = false;
      if (!item[resourceId]?.resourceTypePermissionUuidList) result = false;

      item[resourceId]?.resourceTypePermissionUuidList.find(
        (accessRoleItem) => {
          debugger;
          if (permissionId === accessRoleItem) result = true;
        }
      );
    });
    return result;
  };

  return (
    <div className="access-section">
      <Row>
        <Col md={8}>
          <div className="client-section">
            <h3>سامانه:</h3>
            {clientsStatus === "rejected" ? (
              <ErrorSection handleRefresh={clientsRefetch} />
            ) : clientsStatus === "pending" ? (
              <Skeleton.Input active />
            ) : (
              <AutoComplete
                className="search-form"
                onSelect={(value, item) => {
                  setSelectedClientId(item.key);
                }}
                filterOption={(inputValue, option) =>
                  option.children.includes(inputValue)
                }
                placeholder={"سامانه را انتخاب کنید"}
                disabled={showAccessTable}
                allowClear
              >
                {clients?.data
                  ?.filter((client) => client.description)
                  ?.map((client) => {
                    return (
                      <AutoComplete.Option
                        key={client.id}
                        value={client.description}
                      >
                        {`${client.description}`}
                      </AutoComplete.Option>
                    );
                  })}
              </AutoComplete>
            )}
          </div>
        </Col>
        <Col md={8}>
          <div className="client-section">
            <h3>منو:</h3>
            {menusStatus === "rejected" ? (
              <ErrorSection handleRefresh={menusRefetch} />
            ) : menusStatus === "pending" ? (
              <Skeleton.Input active />
            ) : (
              <AutoComplete
                className="search-form"
                onSelect={(value, item) => {
                  setSelectedMenuId(item.key);
                }}
                filterOption={(inputValue, option) =>
                  option.children.includes(inputValue)
                }
                placeholder={"منو را انتخاب کنید"}
                disabled={showAccessTable || !selectedClientId}
                allowClear
              >
                {menus?.data?.map((client) => {
                  return (
                    <AutoComplete.Option key={client.id} value={client.title}>
                      {`${client.title}`}
                    </AutoComplete.Option>
                  );
                })}
              </AutoComplete>
            )}
          </div>
        </Col>
      </Row>
      {selectedMenuId && selectedClientId && (
        <div className="control-button">
          <Button
            type="primary"
            onClick={() => setShowAccessTable(true)}
            disabled={showAccessTable}
          >
            مشاهده
            <AiOutlineTable />
          </Button>
          <Button
            type="danger"
            onClick={() => setShowAccessTable(false)}
            disabled={!showAccessTable}
          >
            انتخاب مجدد
            <HiOutlineRefresh />
          </Button>
        </div>
      )}
      {resourcesStatus === "rejected" ? (
        <ErrorSection handleRefresh={resourcesRefetch} />
      ) : resourcesStatus === "pending" ? (
        <Skeleton active />
      ) : resourcesStatus === "resolved" && showAccessTable ? (
        <>
          {permissions?.data?.rows?.length > 0 ? (
            <>
              <table className="info-table">
                <thead>
                  <tr ref={tableHeader}>
                    <td>نام منابع</td>
                    {permissions?.data?.rows?.map((header) => (
                      <td key={header.id}>{header.title}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resources?.data?.map((resource) => {
                    return (
                      <tr key={resource.id}>
                        <td className="bold-text">{resource.title}</td>
                        {permissions?.data?.rows?.map((permission) => {
                          const resourceTypePermission =
                            resource.permissionDtoList;
                          let selectedPermission = resourceTypePermission?.find(
                            (rtp) => rtp.title === permission.title
                          );
                          // const ic = isChecked({
                          //   allValues,
                          //   resource,
                          //   permission,
                          // });

                          // console.log("ic", ic);

                          return (
                            <td key={permission.permissionTitle}>
                              <input
                                type="checkbox"
                                value={`${permission.id}`}
                                onChange={(e) => {
                                  let temp = { ...allValues };
                                  temp[resource.id] = togglePermission(
                                    permission.id,
                                    temp[resource.id]
                                  );
                                  setAllValues((p) => ({ ...p, ...temp }));
                                }}
                                checked={isChecked({
                                  allValues,
                                  resourceId: resource.id,
                                  permissionId: permission.id,
                                })}
                                // checked={allValues[
                                //   resource?.id
                                // ]?.resourceTypePermissionUuidList?.find(
                                //   (accessRoleItem) => {
                                //     debugger;
                                //     if (permission?.id === accessRoleItem)
                                //       return true;
                                //   }
                                // )}
                              />
                            </td>
                          );
                          // const resourceTypePermission =
                          //   resource.resourceTypePermissions;
                          // let selectedPermission = resourceTypePermission?.find(
                          //   (rtp) => rtp.permissionTitle === permission.title
                          // );
                          // if (selectedPermission) {
                          //   return (
                          //     <td key={permission.permissionTitle}>
                          //       <input
                          //         type="checkbox"
                          //         value={`${selectedPermission.id}`}
                          //         onChange={(e) => {
                          //           let temp = { ...allValues };
                          //           temp[resource.id] = togglePermission(
                          //             selectedPermission.id,
                          //             temp[resource.id]
                          //           );
                          //           setAllValues((p) => ({ ...p, ...temp }));
                          //         }}
                          //       />
                          //     </td>
                          //   );
                          // } else {
                          //   return (
                          //     <td key={permission.permissionTitle}>---</td>
                          //   );
                          // }
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="FormButtons">
                <SubmitBtn
                  disabled={!selectedMenuId}
                  onSubmit={handleSave}
                  isUpdating={isUpdating}
                />
              </div>
            </>
          ) : (
            <h3>منبعی وجود ندارد</h3>
          )}
        </>
      ) : null}
    </div>
  );
};

export default ResourcePermissions;
