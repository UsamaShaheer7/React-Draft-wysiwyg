import React, { useEffect, useState } from "react";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import draftToHtml from "draftjs-to-html";
import ColorPic from "./ColorPic";

const toolbarOptions = {
  options: [
    "inline",
    "blockType",
    "fontSize",
    "fontFamily",
    "colorPicker",
    "list",
    "textAlign",
    "link",
    "embedded",
    "emoji",
    "image",
    "remove",
    "history",
  ],
  inline: {
    options: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "monospace",
      "superscript",
      "subscript",
    ],
  },
  blockType: {
    options: [
      "Normal",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "Blockquote",
      "Code",
    ],
  },
  fontSize: {
    options: [8, 10, 12, 14, 16, 18, 24, 30, 36],
  },
  fontFamily: {
    options: [
      "Arial",
      "Helvetica",
      "Times New Roman",
      "Courier New",
      "Verdana",
      "Georgia",
      "Palatino",
      "Garamond",
      "Bookman",
      "Comic Sans MS",
      "Trebuchet MS",
      "Arial Black",
      "Impact",
      "Tahoma",
      "Calibri",
      "Cambria",
      "Lucida Console",
      "Lucida Sans Unicode",
      "Century Gothic",
      "Franklin Gothic Medium",
    ],
  },
  colorPicker: {
    className: "demo-option-custom",
    popupClassName: "demo-popup-custom",
    // component: ColorPic,
  },
  list: {
    options: ["unordered", "ordered"],
  },
  textAlign: {
    options: ["left", "center", "right", "justify"],
  },
  link: {
    inDropdown: false,
    showOpenOptionOnHover: true,
    defaultTargetOption: "_self",
    options: ["link"],
  },
  // embedded: {
  //   icon: '<i class="fa fa-link"></i>',
  //   title: 'Embedded Link',
  // },
  emoji: {
    className: "emoji-icon",
    popupClassName: "emoji-popup",
    options: ["🙂", "😀", "😍", "😎", "🤔", "👍", "👎", "🔥", "❤️", "🎉", "🚀"],
  },
  // image: {
  //   uploadEnabled: true,
  //   urlEnabled: false,
  //   alignmentEnabled: true,
  //   previewImage: true,
  //   inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
  //   alt: { present: false, mandatory: false },
  //   defaultSize: {
  //     height: "auto",
  //     width: "auto",
  //   },
  // },
  // remove: { icon: '<i class="fa fa-trash"></i>' },
  // history: { icon: '<i class="fa fa-undo"></i>' },
};

const MyEditor = () => {
  const [htmlContentdangerously, setHtmlContent] = useState("");
  const formik = useFormik({
    initialValues: {
      content: EditorState.createEmpty(),
    },
    validationSchema: Yup.object({
      content: Yup.mixed().required("Content is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const htmlContent = draftToHtml(
        convertToRaw(values.content.getCurrentContent())
      );
      setHtmlContent(htmlContent);
      console.log("Submitted HTML content:", htmlContent);
      // You can do further processing here with the HTML content
      resetForm();
    },
  });

  useEffect(() => {
    const htmlContent =
      '<p><strong><em><ins>Usama Shaheer</ins></em></strong></p> <img src="https://images.pexels.com/photos/4123018/pexels-photo-4123018.jpeg" alt="Your image description here" />';
       // Convert HTML string to Draft.js content state
    const editorState = EditorState.createWithContent(
      ContentState.createFromBlockArray(
        convertFromHTML(htmlContent).contentBlocks,
        convertFromHTML(htmlContent).entityMap
      )
    );
    // Set the editor state as Formik field value
    formik.setFieldValue("content", editorState);
  }, []);
  useEffect(() => {
    if (!htmlContentdangerously) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContentdangerously, "text/html");

    // Select all tags inside the htmlContent
    const allTags = doc.querySelectorAll("*");
    // Select all <strong> tags inside the htmlContent
    const strongTags = doc.querySelectorAll("strong");
    const imgTags = doc.getElementsByTagName("img");

    // Apply custom CSS styles to center the images
    Array.from(imgTags).forEach((img) => {
      img.classList.add("custom-image-class"); // Add custom CSS class to image tag
    });
    // Apply custom CSS styles to center the images
    // Array.from(imgTags).forEach((img) => {
    //   img.style.display = "block"; // Make the image a block element
    //   img.style.margin = "auto"; // Center the image horizontally
    // });
    // Apply custom CSS styles to each <strong> tag
    strongTags.forEach((tag) => {
      tag.style.fontWeight = "bold"; // Example custom style
      tag.style.color = "blue"; // Example custom style
    });

    // Convert the manipulated HTML back to string and set the state
    setHtmlContent(doc.documentElement.outerHTML);
  }, [htmlContentdangerously]);
  return (
    <div className="">
      <form onSubmit={formik.handleSubmit}>
        <Editor
          toolbarClassName="custom-toolbar-class"
          wrapperClassName="custom-wrapper-class"
          editorClassName="custom-editor-class"
          editorState={formik.values.content}
          onEditorStateChange={(newEditorState) => {
            formik.setFieldValue("content", newEditorState);
          }}
          localization={{
            locale: "en",
          }}
          toolbar={toolbarOptions}
        />
        {formik.touched.content && formik.errors.content ? (
          <div>{formik.errors.content}</div>
        ) : null}
        <button type="submit">Submit</button>
      </form>
      <div dangerouslySetInnerHTML={{ __html: htmlContentdangerously }}></div>
    </div>
  );
};

export default MyEditor;
