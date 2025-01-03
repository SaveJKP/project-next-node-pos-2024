"use client";

import { useEffect, useState } from "react";
import MyModal from "../components/MyModal";
import Swal from "sweetalert2";
import axios from "axios";
import config from "@/app/config";

export default function Page() {
  // ใช้ useState เพื่อจัดการกับ state ของแต่ละฟิลด์ เช่น ชื่อ, หมายเหตุ, id, foodTypeId, moneyAdded และอื่นๆ
  const [foodTypes, setFoodTypes] = useState([]); // เก็บข้อมูลประเภทอาหาร
  const [foodSizes, setFoodSizes] = useState([]); // เก็บข้อมูลขนาดอาหาร
  
  const [name, setName] = useState(""); // ชื่อประเภทอาหาร/ขนาดอาหาร
  const [remark, setRemark] = useState(""); // หมายเหตุ
  const [id, setId] = useState(0); // id ของขนาดอาหาร (ใช้เพื่อการแก้ไขหรือสร้างรายการใหม่)
  const [foodTypeId, setFoodTypeId] = useState(0); // foodTypeId (ประเภทอาหาร) ที่เกี่ยวข้อง
  const [moneyAdded, setMoneyAdded] = useState(0); // ค่าเงินเพิ่มเติม

  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  useEffect(() => {
    fetchData(); // ดึงข้อมูลขนาดอาหาร
    fetchDataFoodType(); // ดึงข้อมูลประเภทอาหาร
  }, []); // [] คือ dependency array ซึ่งหมายความว่า useEffect จะทำงานเพียงครั้งเดียวเมื่อ component ถูก mount

  // ฟังก์ชันดึงข้อมูลขนาดอาหารจาก API
  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiServer + "/api/foodSize/list"); // ส่ง GET request ไปที่ API
      setFoodSizes(res.data.results); // อัปเดต state 'foodSizes' ด้วยข้อมูลที่ได้รับ
    } catch (e: any) {
      Swal.fire({
        // แสดงข้อความแจ้งเตือนหากเกิดข้อผิดพลาด
        title: "error",
        icon: "error",
        text: e.message,
      });
    }
  };

  // ฟังก์ชันดึงข้อมูลประเภทอาหารจาก API
  const fetchDataFoodType = async () => {
    try {
      const res = await axios.get(config.apiServer + "/api/foodType/list"); // ส่ง GET request ไปที่ API
      if (res.data.results.length > 0) {
        setFoodTypes(res.data.results); // อัปเดต state 'foodTypes' ด้วยข้อมูลที่ได้รับ
        setFoodTypeId(res.data.results[0].id); // ตั้งค่า foodTypeId เป็นประเภทอาหารตัวแรก
      }
    } catch (e: any) {
      Swal.fire({
        // แสดงข้อความแจ้งเตือนหากเกิดข้อผิดพลาด
        title: "error",
        icon: "error",
        text: e.message,
      });
    }
  };

  // ฟังก์ชันสำหรับแก้ไขข้อมูลขนาดอาหารเมื่อคลิกที่ปุ่มแก้ไข
  const edit = (item: any) => {
    setId(item.id); // กำหนด id ของรายการที่จะแก้ไข
    setName(item.name); // ตั้งชื่อให้ตรงกับข้อมูลใน item
    setRemark(item.remark); // ตั้งหมายเหตุ
    setMoneyAdded(item.moneyAdded); // ตั้งค่าเงินเพิ่มเติม
    setFoodTypeId(item.foodTypeId); // ตั้งค่า foodTypeId ที่เชื่อมโยงกับ item
    openModal();
  };

  // ฟังก์ชันลบข้อมูลขนาดอาหาร
  const remove = async (item: any) => {
    try {
      const button = await Swal.fire({
        // แสดง confirm dialog ให้ผู้ใช้ยืนยันการลบ
        title: "ลบข้อมูล",
        text: "คุณต้องการลบข้อมูลนี้",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (button.isConfirmed) {
        // ถ้าผู้ใช้ยืนยันการลบ
        await axios.delete(
          config.apiServer + "/api/foodSize/remove/" + item.id
        ); // ส่งคำขอ DELETE ไปที่ API
        fetchData(); // รีเฟรชข้อมูลหลังจากลบเสร็จ
      }
    } catch (e: any) {
      Swal.fire({
        // แสดงข้อผิดพลาดถ้าเกิดข้อผิดพลาดในการลบ
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  // ฟังก์ชันสำหรับบันทึกข้อมูล (ทั้งสร้างใหม่และอัปเดต)
  const save = async () => {
    try {
      const payload = {
        // ข้อมูลที่จะส่งไปยัง API
        name: name,
        remark: remark,
        id: id,
        foodTypeId: foodTypeId,
        moneyAdded: moneyAdded,
      };

      if (id == 0) {
        // ถ้า id เป็น 0 แสดงว่าเป็นการสร้างใหม่
        await axios.post(config.apiServer + "/api/foodSize/create", payload); // ส่งคำขอ POST ไปที่ API เพื่อสร้างข้อมูลใหม่
      } else {
        // ถ้า id ไม่ใช่ 0 แสดงว่าเป็นการอัปเดตข้อมูล
        await axios.put(config.apiServer + "/api/foodSize/update", payload); // ส่งคำขอ PUT ไปที่ API เพื่ออัปเดตข้อมูล
        setId(0); // รีเซ็ต id หลังจากอัปเดตข้อมูลเสร็จ
      }

      fetchData(); // รีเฟรชข้อมูลหลังจากบันทึกเสร็จ

      // ปิด modal เมื่อบันทึกสำเร็จ
      closeModal();
    } catch (e: any) {
      Swal.fire({
        // แสดงข้อผิดพลาดหากเกิดข้อผิดพลาดในการบันทึก
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  // ฟังก์ชันรีเซ็ตข้อมูลในฟอร์ม
  const clearForm = () => {
    setId(0); // รีเซ็ต id
    setName(""); // รีเซ็ตชื่อ
    setRemark(""); // รีเซ็ตหมายเหตุ
    setMoneyAdded(0); // รีเซ็ตค่าเงินเพิ่มเติม
    openModal();
  };

  return (
    <>
      <div className="card">
        <div className=" card-title">
          ขนาดอาหาร
        </div>
        <div className=" p-4">
          <button
            className="btn"
            onClick={() => {
              clearForm();
            }}
          >
            <i className="fa fa-plus mr-2"></i> เพิ่มรายการ
          </button>

          <table className="table">
            <thead className="thead">
              <tr className="">
                <th className="th w-36">ประเภทอาหาร</th>
                <th className="th w-24">ชื่อ</th>
                <th className="th">หมายเหตุ</th>
                <th className="th w-24 ">
                  คิดเงินเพิ่ม
                </th>
                <th className="th w-28"></th>
              </tr>
            </thead>
            <tbody>
              {foodSizes.map((foodSize: any, index: number) => (
                <tr
                  key={foodSize.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-b`}
                >
                  <td className="td">
                    {foodSize.FoodType.name}
                  </td>
                  <td className="td">{foodSize.name}</td>
                  <td className="td">{foodSize.reamrk}</td>
                  <td className="td">
                    {foodSize.moneyAdded}
                  </td>
                  <td className="td ">
                    <div className="w-full h-full flex justify-center items-center space-x-2">
                      <button
                        className="btn-edit"
                        onClick={() => {
                          edit(foodSize);
                        }}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        className="btn-delete"
                        onClick={(e) => remove(foodSize)}
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isOpen && (
        <MyModal id="modalFoodSize" title="ขนาดอาหาร" onClose={closeModal}>
          <div className="mt-3">ประเภทอาหาร</div>
          <select
            className=" border border-gray-300 rounded-md p-2 w-full"
            value={foodTypeId}
            onChange={(e) => setFoodTypeId(parseInt(e.target.value))}
          >
            {foodTypes.map((foodType: any) => (
              <option value={foodType.id} key={foodType.id}>
                {foodType.name}
              </option>
            ))}
          </select>

          <div className="mt-3">ชื่อ</div>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="mt-3">คิดเงินเพิ่ม (บาท)</div>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            value={moneyAdded}
            type="number"
            onChange={(e) => setMoneyAdded(parseInt(e.target.value))}
          />

          <div className="mt-3">หมายเหตุ</div>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />

          <div className="mt-4 flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={save}
            >
              บันทึก
            </button>
          </div>
        </MyModal>
      )}
    </>
  );
}
