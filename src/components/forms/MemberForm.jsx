import React, { useState } from "react";
import { Formik, Form, Field } from "formik";

const MemberForm = ({ initialValues, isEdit, onClose, handleSubmitUser }) => {
  const [serverError, setServerError] = useState("");

  const initialFormValues = isEdit
    ? {
        ...initialValues,
        skills: initialValues.skills?.join(", ") || "",
        roleInLocalChurch: initialValues.roleInLocalChurch?.join(", ") || "",
        roleInYadahMinistry:
          initialValues.roleInYadahMinistry?.join(", ") || "",
      }
    : {
        fullName: "",
        phoneNumber: "",
        emailAddress: "",
        dateOfBirth: "",
        gender: "",
        maritalStatus: "",
        numberOfChildren: 0,
        residentialAddress: "",
        workAddress: "",
        educationalBackground: "",
        occupation: "",
        skills: "",
        localChurchName: "",
        localChurchAddress: "",
        roleInLocalChurch: "",
        roleInYadahMinistry: "",
        batchInYadahMinistry: "",
      };

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError(""); // reset old error
    const formattedValues = {
      ...values,
      skills: values.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      roleInLocalChurch: values.roleInLocalChurch
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      roleInYadahMinistry: values.roleInYadahMinistry
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      await handleSubmitUser(formattedValues);
    } catch (error) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center overflow-y-auto p-4 z-50">
      <div className="bg-amber-50 rounded-lg shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-white mb-6 text-center p-2 rounded-md bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 shadow-md">
          {isEdit ? "Update Member" : "Add Member"}
        </h2>

        <Formik
          initialValues={initialFormValues}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {serverError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-sm">
                  {serverError}
                </div>
              )}

              <Field
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
                required
              />
              <Field
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
                required
              />
              <Field
                type="email"
                name="emailAddress"
                placeholder="Email Address"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
              />

              <Field
                type="text"
                name="dateOfBirth"
                placeholder="Date of Birth"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
              />

              <Field
                as="select"
                name="gender"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Field>

              <Field
                as="select"
                name="maritalStatus"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
              >
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </Field>

              <Field
                type="number"
                name="numberOfChildren"
                placeholder="Number of Children"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
                min={0}
              />
              <Field
                type="text"
                name="residentialAddress"
                placeholder="Residential Address"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
              />
              <Field
                type="text"
                name="workAddress"
                placeholder="Work Address"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
              />
              <Field
                type="text"
                name="educationalBackground"
                placeholder="Educational Background"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
              />
              <Field
                type="text"
                name="occupation"
                placeholder="Occupation"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
              />
              <Field
                type="text"
                name="skills"
                placeholder="Skills (comma separated)"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
              />
              <Field
                type="text"
                name="localChurchName"
                placeholder="Local Church Name"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
              />
              <Field
                type="text"
                name="localChurchAddress"
                placeholder="Local Church Address"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
              />
              <Field
                type="text"
                name="roleInLocalChurch"
                placeholder="Role In Local Church (comma separated)"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
              />
              <Field
                type="text"
                name="roleInYadahMinistry"
                placeholder="Role In Yadah Ministry (comma separated)"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
              />
              <Field
                type="number"
                name="batchInYadahMinistry"
                placeholder="Batch In Yadah Ministry"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
                min={0}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded text-white font-bold transition ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : isEdit
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isSubmitting
                  ? isEdit
                    ? "Updating..."
                    : "Adding..."
                  : isEdit
                  ? "Update Member"
                  : "Add Member"}
              </button>
            </Form>
          )}
        </Formik>

        <button
          onClick={onClose}
          className="mt-4 text-red-500 hover:underline text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MemberForm;
