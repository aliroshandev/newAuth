import React, { useMemo, useState } from "react";
import { Button, Col, Form, notification, Row } from "antd";
import { useGetApiCall } from "base/hooks/useGetApiCall";
import RenderElement from "base/components/RenderElement/RenderElement";
import { asyncHttpRequest } from "base/services/asyncHttpRequest";

const RoleResource = () => {
  const [form] = Form.useForm();
  const [selectedClientId, setSelectedClientId] = useState();
  const [selectedMenuId, setSelectedMenuId] = useState();
  const [resourceId, setResourceId] = useState();
  const [roleId, setRoleId] = useState();
  const [isUpdating, setIsUpdating] = useState(false);

  const { response: clients } = useGetApiCall({
    endpoint: "/api/clients",
  });
  const { response: menus } = useGetApiCall({
    endpoint: `/api/menus/client-id?clientId=${selectedClientId}`,
    enabled: !!selectedClientId,
  });
  const { response: resources } = useGetApiCall({
    endpoint: `/api/resources/menu-id?menuId=${selectedMenuId}`,
    enabled: !!selectedMenuId,
  });

  const { response: roles } = useGetApiCall({
    endpoint: "/api/roles",
  });

  const ITEMS = useMemo(
    () => [
      {
        label: "سامانه",
        name: "clientId",
        type: "autocomplete",
        data: clients?.data || [],
        autoCompleteValue: "id",
        autoCompleteTitle: "client",
        handleChange(...rest) {
          setSelectedClientId(rest[1]?.key);
        },
        size: 12,
      },
      {
        label: "منو",
        name: "menuId",
        type: !!selectedClientId ? "autocomplete" : "text",
        data: menus?.data || [],
        autoCompleteValue: "id",
        autoCompleteTitle: "title",
        handleChange(...rest) {
          setSelectedMenuId(rest[1]?.key);
        },
        isDisabled: !!selectedClientId ? false : true,
        size: 12,
      },
      {
        label: "منبع",
        name: "resourceId",
        type: !!selectedMenuId ? "autocomplete" : "text",
        data: resources?.data || [],
        autoCompleteValue: "id",
        autoCompleteTitle: "title",
        handleChange(...rest) {
          setResourceId(rest[1]?.key);
        },
        isDisabled: !!selectedMenuId ? false : true,
        size: 12,
      },
      {
        label: "نقش",
        name: "roleId",
        type: "autocomplete",
        data: roles?.data || [],
        autoCompleteValue: "id",
        autoCompleteTitle: "name",
        handleChange(...rest) {
          setRoleId(rest[1]?.key);
        },
        size: 12,
      },
    ],
    [
      clients?.data,
      menus?.data,
      resources?.data,
      roles?.data,
      selectedClientId,
      selectedMenuId,
    ]
  );

  async function submitHandler() {
    setIsUpdating(true);
    asyncHttpRequest({
      method: "POST",
      endpoint: "api/role-resources",
      data: {
        resourceId,
        roleId,
      },
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

  return (
    <>
      <Form onFinish={submitHandler}>
        <Row>
          {ITEMS.map((item) => (
            <Col md={item.size}>
              <RenderElement searchForm={form} {...item} />
            </Col>
          ))}
        </Row>
        <Button
          htmlType="submit"
          type="primary"
          disabled={roleId && resourceId ? false : true}
          loading={isUpdating}
        >
          ذخیره
        </Button>
      </Form>
    </>
  );
};

export default RoleResource;
